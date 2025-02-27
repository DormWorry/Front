import React from 'react'
import * as S from '../letter-styles'
import { MailboxLayoutProps } from '../types'

/**
 * 편지함의 공통 레이아웃 컴포넌트
 */
const MailboxLayout: React.FC<MailboxLayoutProps> = ({ children, onGoBack }) => {
  return (
    <S.Container>
      {/* 맥북 상단 프레임 */}
      <S.MacFrame>
        <S.MacControls>
          <S.MacButton
            color="#FF5F56"
            onClick={onGoBack}
            title="메인으로 돌아가기"
          />
          <S.MacButton color="#FFBD2E" title="최소화" />
          <S.MacButton color="#27C93F" title="최대화" />
        </S.MacControls>
      </S.MacFrame>

      {/* 내용 래퍼 - 맥북 프레임 아래에 표시됨 */}
      <S.ContentWrapper>{children}</S.ContentWrapper>
    </S.Container>
  )
}

export default MailboxLayout
