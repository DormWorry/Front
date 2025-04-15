import { useState, useEffect } from 'react'

interface CardStyle {
  transform: string
  opacity: number
  zIndex?: number
  transition?: string
}

interface UseCarouselReturn {
  activeIndex: number
  selectedCard: number | null
  isMobile: boolean
  handlePrevClick: () => void
  handleNextClick: () => void
  handleCardClick: (cardId: number) => void
  handleCloseModal: () => void
  getCardStyle: (index: number) => CardStyle
}

export const useCarousel = (totalCards: number): UseCarouselReturn => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handlePrevClick = () => {
    setActiveIndex((prev) => (prev === 0 ? totalCards - 1 : prev - 1))
  }

  const handleNextClick = () => {
    setActiveIndex((prev) => (prev === totalCards - 1 ? 0 : prev + 1))
  }

  const handleCardClick = (cardId: number) => {
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
        zIndex: diff === 0 ? 10 : 5 - Math.abs(diff),
        transition: 'all 0.5s ease',
      }
    }
    return {
      transform: `rotateY(${(index - activeIndex) * 60}deg) translateZ(300px)`,
      opacity: index === activeIndex ? 1 : 0.5,
      zIndex: 10 - Math.abs(index - activeIndex),
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
  }
}
