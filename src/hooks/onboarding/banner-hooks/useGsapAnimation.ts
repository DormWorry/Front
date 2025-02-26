import { useEffect, RefObject } from 'react'
import gsap from 'gsap'

interface AnimationRefs {
  sloganRef: RefObject<HTMLDivElement | null>
  title1Ref: RefObject<HTMLDivElement | null>
  title2Ref: RefObject<HTMLDivElement | null>
  descRef: RefObject<HTMLDivElement | null>
  highlight1Ref: RefObject<HTMLSpanElement | null>
  highlight2Ref: RefObject<HTMLSpanElement | null>
  underline1Ref: RefObject<HTMLSpanElement | null>
  underline2Ref: RefObject<HTMLSpanElement | null>
}

/**
 * GSAP를 사용하여 배너 컴포넌트에 애니메이션을 적용하는 커스텀 훅
 * @param isTypingComplete 타이핑 애니메이션 완료 여부
 * @param refs 애니메이션을 적용할 엘리먼트의 ref 객체들
 */
const useGsapAnimation = (isTypingComplete: boolean, refs: AnimationRefs): void => {
  const {
    sloganRef,
    title1Ref,
    title2Ref,
    descRef,
    highlight1Ref,
    highlight2Ref,
    underline1Ref,
    underline2Ref,
  } = refs

  useEffect(() => {
    if (isTypingComplete) {
      // 타이틀 애니메이션 타임라인 생성
      const tl = gsap.timeline()

      // 슬로건 완전히 표시
      tl.to(sloganRef.current, {
        opacity: 1,
        duration: 0.5,
      })

        // 첫 번째 타이틀 애니메이션
        .to(
          title1Ref.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.2',
        )

        // 두 번째 타이틀 애니메이션
        .to(
          title2Ref.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.3',
        )

        // 하이라이트 밑줄 애니메이션
        .to(
          underline1Ref.current,
          {
            scaleX: 1,
            duration: 0.4,
            ease: 'power1.out',
          },
          '-=0.1',
        )
        .to(
          underline2Ref.current,
          {
            scaleX: 1,
            duration: 0.4,
            ease: 'power1.out',
          },
          '-=0.2',
        )

        // 하이라이트 단어 강조 효과
        .to(
          highlight1Ref.current,
          {
            scale: 1.05,
            duration: 0.25,
            yoyo: true,
            repeat: 1,
          },
          '-=0.2',
        )
        .to(
          highlight2Ref.current,
          {
            scale: 1.05,
            duration: 0.25,
            yoyo: true,
            repeat: 1,
          },
          '-=0.3',
        )

        // 설명 텍스트 페이드인
        .to(
          descRef.current,
          {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.2',
        )
    }
  }, [
    isTypingComplete,
    sloganRef,
    title1Ref,
    title2Ref,
    descRef,
    highlight1Ref,
    highlight2Ref,
    underline1Ref,
    underline2Ref,
  ])
}

export default useGsapAnimation
