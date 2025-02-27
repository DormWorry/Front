import React, { useState } from 'react'
import { useRouter } from 'next/router'
import LetterDetail from './LetterDetail'
import * as S from './letter-styles'
import { useLetterState } from '../../hooks/letter'
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

  // 사용자 상태 관리 훅 호출
  const {
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
  } = useLetterState()

  const handleGoBack = () => {
    router.push('/main')
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <MailboxLayout onGoBack={handleGoBack}>
      {/* 프로필 영역 - 왼쪽 사이드바 */}
      <ProfileSidebar
        roomNumber="1205호"
        userName="권도훈"
        avatarSrc="/logo.png"
        onComposeClick={handleComposeClick}
        onImageError={handleImageError}
        imageError={imageError}
      />

      {/* 컨텐츠 영역 - 오른쪽 메인 */}
      <S.ContentContainer>
        <S.Header>
          <h1>마음의 편지함</h1>
        </S.Header>

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
