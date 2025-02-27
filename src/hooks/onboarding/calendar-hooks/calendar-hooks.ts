import { useState, useEffect, useRef } from 'react'

export const CARDS_PER_VIEW = 3
export const AUTO_SLIDE_INTERVAL = 5000

export const useCardLayout = (totalItems: number) => {
  const [maxIndex, setMaxIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(3)

  useEffect(() => {
    const updateCardLayout = () => {
      let cardsToShow = 3
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) {
          cardsToShow = 1
        } else if (window.innerWidth < 1200) {
          cardsToShow = 2
        }
      }

      setCardsPerView(cardsToShow)
      setMaxIndex(Math.max(0, totalItems - cardsToShow))
    }

    updateCardLayout()

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateCardLayout)
      return () => window.removeEventListener('resize', updateCardLayout)
    }
  }, [totalItems])

  return { maxIndex, cardsPerView }
}

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
            return prevIndex < maxIndex ? prevIndex + 1 : 0
          })
        }
      }, AUTO_SLIDE_INTERVAL)
    }

    startAutoSlide()

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
      let cardWidth = 33.333
      
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) {
          cardWidth = 100
        } else if (window.innerWidth < 1200) {
          cardWidth = 50
        }
      }

      // 각 카드 사이의 gap을 고려한 이동 계산
      const gapSize = 1.5;
      return `translateX(-${currentIndex * (cardWidth + gapSize)}%)`;
    },
  }
}

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
