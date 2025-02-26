import { useState, useEffect, useRef } from 'react'

export const CARDS_PER_VIEW = 3
export const AUTO_SLIDE_INTERVAL = 5000

// 화면 크기에 따른 캘린더 카드 레이아웃 관리
export const useCardLayout = (totalItems: number) => {
  const [maxIndex, setMaxIndex] = useState(0)

  useEffect(() => {
    const updateCardLayout = () => {
      // 모바일 1개, 태블릿 2개, 데스크탑 3개
      let cardsToShow = 3
      if (window.innerWidth < 768) {
        cardsToShow = 1
      } else if (window.innerWidth < 1200) {
        cardsToShow = 2
      }

      setMaxIndex(Math.max(0, totalItems - cardsToShow))
    }

    updateCardLayout()
    window.addEventListener('resize', updateCardLayout)
    return () => window.removeEventListener('resize', updateCardLayout)
  }, [totalItems])

  return { maxIndex }
}

// 자동 슬라이드 관리

export const useAutoSlide = (maxIndex: number, isHovering: boolean) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const startAutoSlide = () => {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current)
      }

      autoSlideTimerRef.current = setInterval(() => {
        if (!isHovering) {
          setCurrentIndex((prevIndex) => {
            // 자동 슬라이드는 무한 사이클
            return prevIndex < maxIndex ? prevIndex + 1 : 0
          })
        }
      }, AUTO_SLIDE_INTERVAL)
    }

    startAutoSlide()

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current)
      }
    }
  }, [maxIndex, isHovering])

  return {
    currentIndex,
    setCurrentIndex,
    getTransformValue: () => {
      return `translateX(-${currentIndex * (100 / CARDS_PER_VIEW)}%)`
    },
  }
}

// 슬라이더 이동 버튼 관리

export const useSliderNavigation = (
  currentIndex: number,
  maxIndex: number,
  setCurrentIndex: (index: number) => void,
) => {
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return {
    handlePrev,
    handleNext,
    isPrevDisabled: currentIndex === 0,
    isNextDisabled: currentIndex >= maxIndex,
  }
}

// 슬라이더 마우스 호버 기능 관리 훅
export const useSliderHover = () => {
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => setIsHovering(true)
  const handleMouseLeave = () => setIsHovering(false)

  return {
    isHovering,
    containerRef,
    handleMouseEnter,
    handleMouseLeave,
  }
}
