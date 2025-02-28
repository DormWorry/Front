import { useState } from 'react'

interface UseCarouselReturn {
  activeIndex: number
  selectedCard: number | null
  handlePrevClick: () => void
  handleNextClick: () => void
  handleCardClick: (cardId: number) => void
  handleCloseModal: () => void
}

export const useCarousel = (totalItems: number): UseCarouselReturn => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedCard, setSelectedCard] = useState<number | null>(null)

  const handlePrevClick = () => {
    setActiveIndex((current) => (current - 1 + totalItems) % totalItems)
  }

  const handleNextClick = () => {
    setActiveIndex((current) => (current + 1) % totalItems)
  }

  const handleCardClick = (cardId: number) => {
    setSelectedCard(cardId)
  }

  const handleCloseModal = () => {
    setSelectedCard(null)
  }

  return {
    activeIndex,
    selectedCard,
    handlePrevClick,
    handleNextClick,
    handleCardClick,
    handleCloseModal,
  }
}
