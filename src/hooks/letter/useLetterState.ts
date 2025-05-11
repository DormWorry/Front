import { useState, useRef, useEffect, useCallback } from 'react'
import { Letter, LetterFormData } from '../../pages/letter/types'
import letterApi from '../../api/letterApi'

/**
 * 편지 기능의 상태 관리를 위한 커스텀 훅
 */
export const useLetterState = () => {
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received')
  const [isComposing, setIsComposing] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [receivedLetters, setReceivedLetters] = useState<Letter[]>([])
  const [sentLetters, setSentLetters] = useState<Letter[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // 각 탭별 스크롤 상태 독립적으로 관리(서로 영향X)
  const [needsReceivedScroll, setNeedsReceivedScroll] = useState(false)
  const [needsSentScroll, setNeedsSentScroll] = useState(false)
  const [isReceivedScrolledToBottom, setIsReceivedScrolledToBottom] =
    useState(false)
  const [isSentScrolledToBottom, setIsSentScrolledToBottom] = useState(false)

  const receivedLetterListRef = useRef<HTMLDivElement>(null)
  const sentLetterListRef = useRef<HTMLDivElement>(null)

  // 사용자 정보 (실제로는 로그인/인증 시스템에서 가져와야 함)
  const userRoomNumber = '1205호'

  // 편지 목록 로딩 함수
  const loadLetters = useCallback(async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'received') {
        const response = await letterApi.getReceivedLetters(userRoomNumber, currentPage)
        if (currentPage === 1) {
          setReceivedLetters(response.data)
        } else {
          setReceivedLetters(prev => [...prev, ...response.data])
        }
        setHasMore(currentPage < response.meta.totalPages)
      } else {
        const response = await letterApi.getSentLetters(userRoomNumber, currentPage)
        if (currentPage === 1) {
          setSentLetters(response.data)
        } else {
          setSentLetters(prev => [...prev, ...response.data])
        }
        setHasMore(currentPage < response.meta.totalPages)
      }
    } catch (error) {
      console.error('편지 로딩 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, currentPage, userRoomNumber])

  // 초기 로드 및 탭 변경 시 데이터 로딩
  useEffect(() => {
    setCurrentPage(1)
    loadLetters()
  }, [activeTab, loadLetters])

  // 페이지 변경 시 추가 데이터 로딩
  useEffect(() => {
    if (currentPage > 1) {
      loadLetters()
    }
  }, [currentPage, loadLetters])

  // 초기 로드 시 스크롤 필요 여부 확인
  useEffect(() => {
    setNeedsReceivedScroll(receivedLetters.length > 5)
    setNeedsSentScroll(sentLetters.length > 5)
  }, [receivedLetters.length, sentLetters.length])

  const handleReceivedScroll = useCallback(() => {
    if (!receivedLetterListRef.current) return

    const { scrollTop, scrollHeight, clientHeight } =
      receivedLetterListRef.current
    const isBottom = scrollHeight - scrollTop - clientHeight < 20

    setIsReceivedScrolledToBottom(isBottom)
    
    // 스크롤이 바닥에 닿고 더 불러올 데이터가 있으면 다음 페이지 로드
    if (isBottom && !isLoading && hasMore) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasMore, isLoading])

  const handleSentScroll = useCallback(() => {
    if (!sentLetterListRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = sentLetterListRef.current
    const isBottom = scrollHeight - scrollTop - clientHeight < 20

    setIsSentScrolledToBottom(isBottom)
    
    // 스크롤이 바닥에 닿고 더 불러올 데이터가 있으면 다음 페이지 로드
    if (isBottom && !isLoading && hasMore) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasMore, isLoading])

  useEffect(() => {
    if (activeTab === 'received') {
      setIsReceivedScrolledToBottom(false)
      // 스크롤 위치 초기화
      if (receivedLetterListRef.current) {
        receivedLetterListRef.current.scrollTop = 0
      }
      handleReceivedScroll()
    } else {
      setIsSentScrolledToBottom(false)
      // 스크롤 위치 초기화
      if (sentLetterListRef.current) {
        sentLetterListRef.current.scrollTop = 0
      }
      handleSentScroll()
    }
  }, [activeTab, handleReceivedScroll, handleSentScroll])

  const handleLetterClick = async (letter: Letter) => {
    try {
      // 편지 상세 정보 가져오기 (id를 문자열로 변환)
      const detailLetter = await letterApi.getLetter(String(letter.id), userRoomNumber)
      setSelectedLetter(detailLetter)
    } catch (error) {
      console.error('편지 상세 조회 실패:', error)
      // 오류 발생시 기존 letter 객체 사용
      setSelectedLetter(letter)
    }
  }

  // 편지 쓰기 관련 함수들
  const handleComposeClick = () => {
    setIsComposing(true)
    setReplyTo(null)
  }

  const handleComposeSubmit = async (letterData: LetterFormData) => {
    try {
      // API를 통해 편지 전송
      await letterApi.sendLetter(letterData)
      
      // 편지 전송 후 보낸 편지함 탭으로 전환하고 목록 새로고침
      setActiveTab('sent')
      setCurrentPage(1)
      loadLetters()
      
      // 편지 작성 종료
      setIsComposing(false)
      setReplyTo(null)
    } catch (error) {
      console.error('편지 보내기 실패:', error)
      alert('편지 보내기에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleReplyClick = (recipientName: string) => {
    setIsComposing(true)
    setReplyTo(recipientName)
    handleCloseDetail()
  }

  const handleReturnToMailbox = () => {
    const confirmMessage = '작성 중인 내용이 사라집니다. 취소하시겠습니까?'
    if (window.confirm(confirmMessage)) {
      setIsComposing(false)
      setReplyTo(null)
    }
  }

  const handleCloseDetail = () => {
    setSelectedLetter(null)
  }

  const handleTabChange = (tab: 'sent' | 'received') => {
    setActiveTab(tab)
  }

  return {
    activeTab,
    isComposing,
    selectedLetter,
    replyTo,
    receivedLetters,
    sentLetters,
    needsReceivedScroll,
    needsSentScroll,
    isReceivedScrolledToBottom,
    isSentScrolledToBottom,
    receivedLetterListRef,
    sentLetterListRef,
    isLoading,
    hasMore,
    handleLetterClick,
    handleComposeClick,
    handleComposeSubmit,
    handleReplyClick,
    handleReturnToMailbox,
    handleCloseDetail,
    handleTabChange,
    handleReceivedScroll,
    handleSentScroll,
  }
}
