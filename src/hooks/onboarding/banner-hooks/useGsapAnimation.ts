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

const useGsapAnimation = (
  isTypingComplete: boolean,
  refs: AnimationRefs,
): void => {
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
      const tl = gsap.timeline({ defaults: { duration: 1.0 } })
      tl.to(sloganRef.current, {
        opacity: 1,
        duration: 1.2,
      })
        .to(
          title1Ref.current,
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out',
          },
          '-=0.3',
        )
        .to(
          title2Ref.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
          },
          '-=0.4',
        )
        .to(
          underline1Ref.current,
          {
            scaleX: 1,
            duration: 0.3,
            ease: 'power1.out',
          },
          '-=0.2',
        )
        .to(
          underline2Ref.current,
          {
            scaleX: 1,
            duration: 0.3,
            ease: 'power1.out',
          },
          '-=0.3',
        )
        .to(
          highlight1Ref.current,
          {
            scale: 1.05,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
          },
          '-=0.2',
        )
        .to(
          highlight2Ref.current,
          {
            scale: 1.05,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
          },
          '-=0.3',
        )
        .to(
          descRef.current,
          {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          },
          '-=0.3',
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
