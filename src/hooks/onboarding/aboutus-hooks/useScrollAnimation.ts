import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DivRef } from '../../../pages/onboarding/components/intro/aboutus/useRefs'

gsap.registerPlugin(ScrollTrigger)

// 타입스크립트 타입 정의: null을 명시적으로 허용
interface ScrollAnimationElements {
  containerRef?: DivRef
  introRef?: DivRef
  descriptionRef?: DivRef
  topRowRef?: DivRef
  bottomRowRef?: DivRef
  bottomRowCardsRefs?: ReadonlyArray<DivRef>
}

const useScrollAnimation = (elements: ScrollAnimationElements): void => {
  const {
    containerRef,
    introRef,
    descriptionRef,
    topRowRef,
    bottomRowRef,
    bottomRowCardsRefs,
  } = elements
  const isInitialized = useRef(false)

  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    if (
      !containerRef?.current ||
      !introRef?.current ||
      !descriptionRef?.current
    ) {
      return
    }

    // 기존 스크롤 트리거 제거
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

    // 초기 상태 설정 - 기본 요소들
    gsap.set([introRef.current, descriptionRef.current], {
      opacity: 0,
      y: 50,
    })

    // 상단 서비스 행 설정 (오른쪽에서 왼쪽으로)
    if (topRowRef?.current) {
      gsap.set(topRowRef.current.children, {
        opacity: 0,
        x: 100, // 오른쪽에서 시작
      })
    }

    // 하단 서비스 행 설정 (오른쪽에서 왼쪽으로 각각 따로)
    if (bottomRowRef?.current) {
      gsap.set(bottomRowRef.current.children, {
        opacity: 0,
        x: 100, // 오른쪽에서 시작
      })
    }

    // 인트로 텍스트 애니메이션
    gsap.to(introRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    })

    // 설명 텍스트 애니메이션
    gsap.to(descriptionRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out',
    })

    // 상단 서비스 행 애니메이션 (오른쪽에서 왼쪽으로)
    if (topRowRef?.current) {
      gsap.to(topRowRef.current.children, {
        scrollTrigger: {
          trigger: topRowRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15, // 각 항목이 연속적으로 나타나도록
        ease: 'power2.out',
      })
    }

    // 하단 서비스 행 애니메이션 (오른쪽에서 왼쪽으로, 각각 따로)
    if (bottomRowRef?.current) {
      const children = bottomRowRef.current.children
      // 각 자식 요소에 대해 별도의 애니메이션 설정
      gsap.to(children[0], {
        scrollTrigger: {
          trigger: bottomRowRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.3, // 첫 번째 카드 지연
        ease: 'power2.out',
      })

      // 두 번째 카드는 더 늦게 나타남
      if (children[1]) {
        gsap.to(children[1], {
          scrollTrigger: {
            trigger: bottomRowRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.6, // 두 번째 카드 더 지연
          ease: 'power2.out',
        })
      }

      // 더 많은 카드가 있다면 추가 처리
      if (children.length > 2) {
        for (let i = 2; i < children.length; i++) {
          gsap.to(children[i], {
            scrollTrigger: {
              trigger: bottomRowRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.6 + (i - 1) * 0.3, // 추가 카드마다 더 지연
            ease: 'power2.out',
          })
        }
      }
    }

    // bottomRowCardsRefs가 제공된 경우 개별 카드 참조를 사용
    if (bottomRowCardsRefs?.length) {
      bottomRowCardsRefs.forEach((cardRef, index) => {
        if (cardRef?.current) {
          gsap.set(cardRef.current, {
            opacity: 0,
            x: 100,
          })

          gsap.to(cardRef.current, {
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.3 + index * 0.3,
            ease: 'power2.out',
          })
        }
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [
    containerRef,
    introRef,
    descriptionRef,
    topRowRef,
    bottomRowRef,
    bottomRowCardsRefs,
  ])
}

export default useScrollAnimation
