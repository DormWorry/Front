import React, { forwardRef } from 'react'
import * as S from '../letter-styles'
import { LetterListProps } from '../types'
import { formatDate } from '../../../utils/dateUtils'

/**
 * 편지 목록 컴포넌트
 */
const LetterList = forwardRef<HTMLDivElement, Omit<LetterListProps, 'listRef'>>(
  (
    {
      letters,
      onLetterClick,
      needsScroll,
      onScroll,
      isScrolledToBottom,
      isEmptyMessage,
    },
    ref,
  ) => {
    // 빈 메시지 렌더링 함수
    const renderEmptyMessage = () => (
      <S.EmptyMessage>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
        <p>{isEmptyMessage}</p>
      </S.EmptyMessage>
    )

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: 0,
          minHeight: 0,
        }}
      >
        <S.LetterList $needsScroll={needsScroll} ref={ref} onScroll={onScroll}>
          {letters && letters.length > 0
            ? letters.map((letter) => (
                <S.LetterItem
                  key={letter.id}
                  onClick={() => onLetterClick(letter.id)}
                >
                  <S.LetterTitle>{letter.title}</S.LetterTitle>
                  <S.LetterMeta>
                    <S.LetterRoom>
                      {letter.isAnonymous ? '익명' : letter.senderName} (
                      {letter.senderRoomNumber})
                    </S.LetterRoom>
                    <S.LetterDate>
                      {formatDate(letter.createdAt, 'YYYY.MM.DD')}
                    </S.LetterDate>
                  </S.LetterMeta>
                </S.LetterItem>
              ))
            : renderEmptyMessage()}
        </S.LetterList>

        {needsScroll && !isScrolledToBottom && (
          <S.ScrollIndicator>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </S.ScrollIndicator>
        )}
      </div>
    )
  },
)

LetterList.displayName = 'LetterList'

export default LetterList
