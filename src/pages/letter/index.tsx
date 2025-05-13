import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import LetterDetail from './LetterDetail'
import * as S from './letter-styles'
import { useRecoilValue } from 'recoil'
import { userAtom } from '../../recoil/atoms/userAtom'
import letterApi, { Letter, LetterData } from '../../api/letter'
import { LetterFormData } from './types'
import {
  MailboxLayout,
  ProfileSidebar,
  MailboxTabs,
  LetterList,
  ComposeSection,
} from './components'

/**
 * 편지 기능 메인 컴포넌트
 */
export default function LetterFeature() {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)
  const userState = useRecoilValue(userAtom)
  
  // 상태 관리
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')
  const [isComposing, setIsComposing] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  
  // 편지 목록 상태
  const [receivedLetters, setReceivedLetters] = useState<Letter[]>([])
  const [sentLetters, setSentLetters] = useState<Letter[]>([])
  
  // 스크롤 상태
  const [needsReceivedScroll, setNeedsReceivedScroll] = useState(false)
  const [needsSentScroll, setNeedsSentScroll] = useState(false)
  const [isReceivedScrolledToBottom, setIsReceivedScrolledToBottom] = useState(true)
  const [isSentScrolledToBottom, setIsSentScrolledToBottom] = useState(true)
  
  // 로딩 및 에러 상태
  const [, setIsLoading] = useState(false)
  const [, setError] = useState<string | null>(null)
  
  // 편지 목록 참조
  const receivedLetterListRef = React.useRef<HTMLDivElement>(null)
  const sentLetterListRef = React.useRef<HTMLDivElement>(null)

  // 편지 목록 불러오기
  const fetchLetters = async () => {
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
  }

  // 편지 상세 정보 불러오기
  const fetchLetterDetail = async (letterId: number) => {
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
  }

  // 컴포넌트 마운트 시 편지 목록 불러오기
  useEffect(() => {
    fetchLetters()
  }, [])

  const handleGoBack = () => {
    router.push('/main')
  }

  const handleImageError = () => {
    setImageError(true)
  }

  // 탭 변경 핸들러
  const handleTabChange = (tab: 'received' | 'sent') => {
    setActiveTab(tab)
  }

  // 편지 클릭 핸들러
  const handleLetterClick = (letterId: number) => {
    fetchLetterDetail(letterId)
  }

  // 편지 작성 클릭 핸들러
  const handleComposeClick = () => {
    setIsComposing(true)
    setReplyTo(null)
  }

  // 편지 작성 완료 핸들러
  const handleComposeSubmit = async (formData: LetterFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const letterData: LetterData = {
        title: formData.title,
        content: formData.content,
        to: formData.recipient,
        isAnonymous: formData.isAnonymous
      }
      
      await letterApi.sendLetter(letterData)
      await fetchLetters()
      setIsComposing(false)
      return true
    } catch (err) {
      console.error('편지 전송 실패:', err)
      setError('편지 전송에 실패했습니다.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // 답장 클릭 핸들러
  const handleReplyClick = (roomNumber: string) => {
    setReplyTo(roomNumber)
    setIsComposing(true)
    setSelectedLetter(null)
  }

  // 편지함으로 돌아가기 핸들러
  const handleReturnToMailbox = () => {
    setIsComposing(false)
  }

  // 상세 보기 닫기 핸들러
  const handleCloseDetail = () => {
    setSelectedLetter(null)
  }

  // 받은 편지함 스크롤 핸들러
  const handleReceivedScroll = () => {
    if (receivedLetterListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = receivedLetterListRef.current
      setIsReceivedScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 10)
    }
  }

  // 보낸 편지함 스크롤 핸들러
  const handleSentScroll = () => {
    if (sentLetterListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = sentLetterListRef.current
      setIsSentScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 10)
    }
  }

  return (
    <MailboxLayout onGoBack={handleGoBack}>
      {/* 프로필 영역 - 왼쪽 사이드바 */}
      <ProfileSidebar
        roomNumber={userState.roomNumber || '방 번호 없음'}
        userName={userState.nickname || '사용자'}
        avatarSrc={userState.profileImage || '/logo.png'}
        onComposeClick={handleComposeClick}
        onImageError={handleImageError}
        imageError={imageError}
      />

      {/* 컨텐츠 영역 - 오른쪽 메인 */}
      <S.ContentContainer>
        {!isComposing && (
          <S.Header>
            <S.BackButton onClick={handleGoBack}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              <span>메인페이지</span>
            </S.BackButton>
            <h1>마음의 편지함</h1>
          </S.Header>
        )}

        {isComposing ? (
          <ComposeSection
            onReturn={handleReturnToMailbox}
            onSubmit={handleComposeSubmit}
            initialRecipient={replyTo}
          />
        ) : (
          <S.TabContainer>
            <MailboxTabs activeTab={activeTab} onTabChange={handleTabChange} />

            {/* 받은 편지함 - 탭이 active일 때만 보여줌 */}
            {activeTab === 'received' && (
              <LetterList
                letters={receivedLetters}
                onLetterClick={handleLetterClick}
                needsScroll={needsReceivedScroll}
                onScroll={handleReceivedScroll}
                isScrolledToBottom={isReceivedScrolledToBottom}
                isEmptyMessage="아직 받은 편지가 없습니다."
                ref={receivedLetterListRef}
              />
            )}

            {/* 보낸 편지함 - 탭이 active일 때만 보여줌 */}
            {activeTab === 'sent' && (
              <LetterList
                letters={sentLetters}
                onLetterClick={handleLetterClick}
                needsScroll={needsSentScroll}
                onScroll={handleSentScroll}
                isScrolledToBottom={isSentScrolledToBottom}
                isEmptyMessage="아직 보낸 편지가 없습니다."
                ref={sentLetterListRef}
              />
            )}
          </S.TabContainer>
        )}
      </S.ContentContainer>

      {/* 편지 상세 모달 */}
      {selectedLetter && (
        <LetterDetail
          letter={selectedLetter}
          onClose={handleCloseDetail}
          onReply={handleReplyClick}
          isReceived={activeTab === 'received'}
        />
      )}
    </MailboxLayout>
  )
}
