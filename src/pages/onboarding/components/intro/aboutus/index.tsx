import React from 'react'
import * as S from './aboutus-styles'
import IntroSection from './IntroSection'
import ServicesGrid from './ServicesGrid'
import { useAboutUsRefs } from './useRefs'
import useScrollAnimation from '../../../../../hooks/onboarding/aboutus-hooks/useScrollAnimation'

const AboutUsComponent: React.FC = () => {
  const {
    containerRef,
    introRef,
    descriptionRef,
    topRowRef,
    bottomRowRef,
    bottomCardRefs
  } = useAboutUsRefs()

  useScrollAnimation({
    containerRef,
    introRef,
    descriptionRef,
    topRowRef,
    bottomRowRef,
    bottomRowCardsRefs: bottomCardRefs,
  })

  return (
    <S.Container ref={containerRef}>
      <IntroSection 
        introRef={introRef} 
        descriptionRef={descriptionRef} 
      />
      
      <ServicesGrid 
        topRowRef={topRowRef}
        bottomRowRef={bottomRowRef}
        bottomCardRefs={bottomCardRefs}
      />
    </S.Container>
  )
}

export default AboutUsComponent
