import { useState, useRef, useEffect } from 'react'
import { Letter, LetterFormData } from '../../pages/letter/types'
import {
  sentLettersDummy,
  receivedLettersDummy,
} from '../../constants/letter-dummy'

/**
 * 편지 기능의 상태 관리를 위한 커스텀 훅
 */
export const useLetterState = () => {
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received')
  const [isComposing, setIsComposing] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [receivedLetters] = useState<Letter[]>([...receivedLettersDummy])
  const [sentLetters, setSentLetters] = useState<Letter[]>([
    ...sentLettersDummy,
  ])

  // 각 탭별 스크롤 상태 독립적으로 관리(서로 영향X)
  const [needsReceivedScroll, setNeedsReceivedScroll] = useState(false)
  const [needsSentScroll, setNeedsSentScroll] = useState(false)
  const [isReceivedScrolledToBottom, setIsReceivedScrolledToBottom] =
    useState(false)
  const [isSentScrolledToBottom, setIsSentScrolledToBottom] = useState(false)

  const receivedLetterListRef = useRef<HTMLDivElement>(null)
  const sentLetterListRef = useRef<HTMLDivElement>(null)

  // 초기 로드 시 스크롤 필요 여부 확인
  useEffect(() => {
    setNeedsReceivedScroll(receivedLetters.length > 5)
    setNeedsSentScroll(sentLetters.length > 5)
  }, [receivedLetters.length, sentLetters.length])

  const handleReceivedScroll = () => {
    if (!receivedLetterListRef.current) return

    const { scrollTop, scrollHeight, clientHeight } =
      receivedLetterListRef.current
    const isBottom = scrollHeight - scrollTop - clientHeight < 20

    setIsReceivedScrolledToBottom(isBottom)
  }

  const handleSentScroll = () => {
    if (!sentLetterListRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = sentLetterListRef.current
    const isBottom = scrollHeight - scrollTop - clientHeight < 20

    setIsSentScrolledToBottom(isBottom)
  }

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
  }, [activeTab])

  const handleLetterClick = (letter: Letter) => {
    setSelectedLetter(letter)
  }

  // 편지 쓰기 관련 함수들
  const handleComposeClick = () => {
    setIsComposing(true)
    setReplyTo(null)
  }

  const handleComposeSubmit = (letterData: LetterFormData) => {
    // 새로운 편지 객체 생성 -> 추후 post 요청
    const newLetter: Letter = {
      id: `sent-${sentLetters.length + 1}`,
      roomNumber: letterData.recipient,
      title: letterData.title,
      content: letterData.content,
      date: new Date().toISOString().split('T')[0],
      read: true,
    }

    // 보낸 편지함에 추가 -> 추후 DB 저장
    setSentLetters((prev) => [newLetter, ...prev])

    // 편지 작성 종료
    setIsComposing(false)
    setReplyTo(null)

    console.log('편지 보내기:', letterData)
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
