import { useState, useRef, useCallback, useEffect } from 'react'
import letterApi, { Letter, LetterData } from '../api/letter'

// 편지 탭 타입
export type LetterTab = 'received' | 'sent'

// 편지 상태 관리 훅
export const useLetterState = () => {
  // 탭 상태
  const [activeTab, setActiveTab] = useState<LetterTab>('received')
  
  // 편지 작성 상태
  const [isComposing, setIsComposing] = useState(false)
  
  // 선택된 편지 상태
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
  
  // 답장 대상 상태
  const [replyTo, setReplyTo] = useState<string | null>(null)
  
  // 편지 목록 상태
  const [receivedLetters, setReceivedLetters] = useState<Letter[]>([])
  const [sentLetters, setSentLetters] = useState<Letter[]>([])
  
  // 스크롤 상태
  const [needsReceivedScroll, setNeedsReceivedScroll] = useState(false)
  const [needsSentScroll, setNeedsSentScroll] = useState(false)
  const [isReceivedScrolledToBottom, setIsReceivedScrolledToBottom] = useState(true)
  const [isSentScrolledToBottom, setIsSentScrolledToBottom] = useState(true)
  
  // 편지 목록 참조
  const receivedLetterListRef = useRef<HTMLDivElement>(null)
  const sentLetterListRef = useRef<HTMLDivElement>(null)
  
  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 편지 목록 불러오기
  const fetchLetters = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // 받은 편지 목록 불러오기
      const receivedResponse = await letterApi.getReceivedLetters()
      setReceivedLetters(receivedResponse.data)
      setNeedsReceivedScroll(receivedResponse.data.length > 5)
      
      // 보낸 편지 목록 불러오기
      const sentResponse = await letterApi.getSentLetters()
      setSentLetters(sentResponse.data)
      setNeedsSentScroll(sentResponse.data.length > 5)
    } catch (err) {
      console.error('편지 목록 불러오기 실패:', err)
      setError('편지 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 편지 상세 정보 불러오기
  const fetchLetterDetail = useCallback(async (letterId: number) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const letter = await letterApi.getLetterDetail(letterId)
      setSelectedLetter(letter)
    } catch (err) {
      console.error('편지 상세 정보 불러오기 실패:', err)
      setError('편지 상세 정보를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 편지 전송하기
  const sendLetter = useCallback(async (letterData: LetterData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await letterApi.sendLetter(letterData)
      // 편지 전송 후 목록 다시 불러오기
      await fetchLetters()
      return true
    } catch (err) {
      console.error('편지 전송 실패:', err)
      setError('편지 전송에 실패했습니다.')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [fetchLetters])

  // 컴포넌트 마운트 시 편지 목록 불러오기
  useEffect(() => {
    fetchLetters()
  }, [fetchLetters])

  // 탭 변경 핸들러
  const handleTabChange = useCallback((tab: LetterTab) => {
    setActiveTab(tab)
  }, [])

  // 편지 클릭 핸들러
  const handleLetterClick = useCallback((letterId: number) => {
    fetchLetterDetail(letterId)
  }, [fetchLetterDetail])

  // 편지 작성 클릭 핸들러
  const handleComposeClick = useCallback(() => {
    setIsComposing(true)
    setReplyTo(null)
  }, [])

  // 편지 작성 완료 핸들러
  const handleComposeSubmit = useCallback(async (letterData: LetterData) => {
    const success = await sendLetter(letterData)
    if (success) {
      setIsComposing(false)
    }
    return success
  }, [sendLetter])

  // 답장 클릭 핸들러
  const handleReplyClick = useCallback((roomNumber: string) => {
    setReplyTo(roomNumber)
    setIsComposing(true)
    setSelectedLetter(null)
  }, [])

  // 편지함으로 돌아가기 핸들러
  const handleReturnToMailbox = useCallback(() => {
    setIsComposing(false)
  }, [])

  // 상세 보기 닫기 핸들러
  const handleCloseDetail = useCallback(() => {
    setSelectedLetter(null)
  }, [])

  // 받은 편지함 스크롤 핸들러
  const handleReceivedScroll = useCallback(() => {
    if (receivedLetterListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = receivedLetterListRef.current
      setIsReceivedScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 10)
    }
  }, [])

  // 보낸 편지함 스크롤 핸들러
  const handleSentScroll = useCallback(() => {
    if (sentLetterListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = sentLetterListRef.current
      setIsSentScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 10)
    }
  }, [])

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
    error,
    handleTabChange,
    handleLetterClick,
    handleComposeClick,
    handleComposeSubmit,
    handleReplyClick,
    handleReturnToMailbox,
    handleCloseDetail,
    handleReceivedScroll,
    handleSentScroll,
  }
}
