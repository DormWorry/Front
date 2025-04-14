import React from 'react'
import * as S from './aboutus-styles'
import { DivRef } from './useRefs'

interface IntroSectionProps {
  introRef: DivRef
  descriptionRef: DivRef
}

const IntroSection: React.FC<IntroSectionProps> = ({ introRef, descriptionRef }) => {
  return (
    <S.TopSection>
      <S.IntroGroup ref={introRef as React.RefObject<HTMLDivElement>}>
        <S.ThinkingIcon src="/svgs/thinkingface.svg" alt="Thinking Icon" />
        <S.IntroTitle>
          해피투게더, <br />
          어떤 서비스인가요?
        </S.IntroTitle>
      </S.IntroGroup>
      <S.IntroDescription
        ref={descriptionRef as React.RefObject<HTMLParagraphElement>}
        dangerouslySetInnerHTML={{
          __html:
            '해피투게더는 기숙사 생활을 더욱 편리하고 즐겁게 만들기 위한 다양한 서비스를 제공합니다.<br/> 룸메이트 매칭부터 공동 배달 주문까지, 여러분의 기숙사 라이프를 더욱 풍요롭게 만들어 드립니다.',
        }}
      />
    </S.TopSection>
  )
}

export default IntroSection
