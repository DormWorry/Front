import { useState, useEffect } from 'react'

interface CardStyle {
  transform: string
  opacity: number
  zIndex?: number
  transition?: string
}

interface UseCarouselReturn {
  activeIndex: number
  selectedCard: number | string | null
  isMobile: boolean
  handlePrevClick: () => void
  handleNextClick: () => void
  handleCardClick: (cardId: number | string) => void
  handleCloseModal: () => void
  getCardStyle: (index: number) => CardStyle
  setTotalCards: (count: number) => void
}

export const useCarousel = (initialTotalCards: number): UseCarouselReturn => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedCard, setSelectedCard] = useState<number | string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [totalCards, setTotalCards] = useState(initialTotalCards)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // totalCards가 변경되면 activeIndex가 범위를 벗어나지 않도록 조정
  useEffect(() => {
    if (totalCards > 0 && activeIndex >= totalCards) {
      setActiveIndex(totalCards - 1)
    }
  }, [totalCards, activeIndex])

  const handlePrevClick = () => {
    if (totalCards <= 0) return
    setActiveIndex((prev) => (prev === 0 ? totalCards - 1 : prev - 1))
  }

  const handleNextClick = () => {
    if (totalCards <= 0) return
    setActiveIndex((prev) => (prev === totalCards - 1 ? 0 : prev + 1))
  }

  const handleCardClick = (cardId: number | string) => {
    setSelectedCard(cardId)
  }

  const handleCloseModal = () => {
    setSelectedCard(null)
  }

  const getCardStyle = (index: number): CardStyle => {
    // 현재 활성화된 카드인지 확인
    const isActive = index === activeIndex;
    
    if (isMobile) {
      // 모바일에서는 기본적으로 모든 카드를 보이게 처리
      return {
        transform: `scale(${isActive ? 1 : 0.95})`,
        opacity: 1,
        zIndex: isActive ? 2 : 1,
        transition: 'all 0.3s ease',
      };
    }
    
    // 데스크톱에서는 3D 회전 효과 유지
    return {
      transform: `rotateY(${(index - activeIndex) * 60}deg) translateZ(300px)`,
      opacity: isActive ? 1 : 0.6,
      zIndex: isActive ? 2 : 1,
    }
  }

  return {
    activeIndex,
    selectedCard,
    isMobile,
    handlePrevClick,
    handleNextClick,
    handleCardClick,
    handleCloseModal,
    getCardStyle,
    setTotalCards,
  }
}
