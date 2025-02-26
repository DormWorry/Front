import React, { useRef } from 'react'
import * as S from './banner-styles'
import useTypingAnimation from '../../../../hooks/onboarding/banner-hooks/useTypingAnimation'
import useGsapAnimation from '../../../../hooks/onboarding/banner-hooks/useGsapAnimation'
import Slogan from './components/Slogan'
import Title from './components/Title'
import Description from './components/Description'
const Banner: React.FC = () => {
  const SLOGAN_TEXT = 'Together, We Create a Happy Dorm Life'
  const TYPING_SPEED = 50
  const TYPING_COMPLETION_PERCENTAGE = 0.7
  const sloganRef = useRef<HTMLDivElement>(null)
  const title1Ref = useRef<HTMLDivElement>(null)
  const title2Ref = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLDivElement>(null)
  const highlight1Ref = useRef<HTMLSpanElement>(null)
  const highlight2Ref = useRef<HTMLSpanElement>(null)
  const underline1Ref = useRef<HTMLSpanElement>(null)
  const underline2Ref = useRef<HTMLSpanElement>(null)

  const { typedText, isTypingComplete } = useTypingAnimation({
    text: SLOGAN_TEXT,
    typingSpeed: TYPING_SPEED,
    completionTriggerPercentage: TYPING_COMPLETION_PERCENTAGE,
  })

  useGsapAnimation(isTypingComplete, {
    sloganRef,
    title1Ref,
    title2Ref,
    descRef,
    highlight1Ref,
    highlight2Ref,
    underline1Ref,
    underline2Ref,
  })

  return (
    <S.BannerContainer>
      <S.TextContainer>
        <Slogan
          typedText={typedText}
          isTypingComplete={isTypingComplete}
          sloganRef={sloganRef}
        />
        <Title
          title1Ref={title1Ref}
          title2Ref={title2Ref}
          highlight1Ref={highlight1Ref}
          highlight2Ref={highlight2Ref}
          underline1Ref={underline1Ref}
          underline2Ref={underline2Ref}
        />
        <Description descRef={descRef} />
      </S.TextContainer>
    </S.BannerContainer>
  )
}

export default Banner
