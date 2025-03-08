import { useState, useEffect } from 'react'

interface CreditState {
  credits: number
  revealedContacts: number[]
}

const STORAGE_KEY = 'roommate_credits'
const DEFAULT_CREDITS = 5

export const useCredits = () => {
  const [creditState, setCreditState] = useState<CreditState>(() => {
    // 브라우저에서만 실행되도록 함
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return { credits: DEFAULT_CREDITS, revealedContacts: [] }
  })

  // 크레딧 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creditState))
  }, [creditState])

  const useCredit = (cardId: number): boolean => {
    if (
      creditState.credits <= 0 ||
      creditState.revealedContacts.includes(cardId)
    ) {
      return false
    }

    setCreditState((prev) => ({
      credits: prev.credits - 1,
      revealedContacts: [...prev.revealedContacts, cardId],
    }))
    return true
  }

  const isRevealed = (cardId: number): boolean => {
    return creditState.revealedContacts.includes(cardId)
  }

  const resetCredits = () => {
    setCreditState({ credits: DEFAULT_CREDITS, revealedContacts: [] })
  }

  const addCredits = (amount: number) => {
    setCreditState((prev) => ({
      ...prev,
      credits: prev.credits + amount,
    }))
  }

  return {
    credits: creditState.credits,
    useCredit,
    isRevealed,
    resetCredits,
    addCredits,
  }
}
