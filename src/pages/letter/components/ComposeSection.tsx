import React from 'react'
import * as S from '../letter-styles'
import ComposeForm from '../ComposeForm'
import { LetterFormData, ComposeSectionProps } from '../types'

/**
 * 편지 작성 섹션 컴포넌트
 */
const ComposeSection: React.FC<ComposeSectionProps> = ({
  onReturn,
  onSubmit,
  initialRecipient,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginBottom: '1.5rem',
          flexShrink: 0,
        }}
      >
        <S.BackButton onClick={onReturn}>
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
          <span>편지함으로 돌아가기</span>
        </S.BackButton>
      </div>
      <ComposeForm
        onCancel={onReturn}
        onSubmit={onSubmit}
        initialRecipient={initialRecipient || ''}
      />
    </div>
  )
}

export default ComposeSection
