import React from 'react'
import * as S from '../letter-styles'
import ComposeForm from '../ComposeForm'
import { ComposeSectionProps } from '../types'

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
      <S.Header>
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
        </S.BackButton>
        <h1>마음의 편지 작성</h1>
      </S.Header>
      <ComposeForm
        onCancel={onReturn}
        onSubmit={onSubmit}
        initialRecipient={initialRecipient}
      />
    </div>
  )
}

export default ComposeSection
