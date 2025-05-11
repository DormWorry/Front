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
    if (isMobile) {
      const diff = index - activeIndex
      return {
        transform: `translateX(${diff * 100}%) scale(${diff === 0 ? 1 : 0.8})`,
        opacity: diff === 0 ? 1 : 0.5,
        zIndex: diff === 0 ? 1 : 0,
        transition: 'all 0.5s ease',
      }
    }
    return {
      transform: `rotateY(${(index - activeIndex) * 60}deg) translateZ(300px)`,
      opacity: index === activeIndex ? 1 : 0.5,
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
