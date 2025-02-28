import { useState } from 'react'
import { RoommateType } from '../pages/matching/types'

interface UseStepReturn {
  step: 1 | 2
  myType: RoommateType | null
  preferredType: RoommateType | null
  handleMyTypeSelect: (type: RoommateType) => void
  handlePreferredTypeSelect: (type: RoommateType) => void
  handleNextStep: (onComplete: (type: RoommateType) => void) => void
}

export const useStep = (): UseStepReturn => {
  const [step, setStep] = useState<1 | 2>(1)
  const [myType, setMyType] = useState<RoommateType | null>(null)
  const [preferredType, setPreferredType] = useState<RoommateType | null>(null)

  const handleMyTypeSelect = (type: RoommateType) => {
    setMyType(type)
  }

  const handlePreferredTypeSelect = (type: RoommateType) => {
    setPreferredType(type)
  }

  const handleNextStep = (onComplete: (type: RoommateType) => void) => {
    if (step === 1 && myType) {
      setStep(2)
    } else if (step === 2 && preferredType) {
      onComplete(preferredType)
    }
  }

  return {
    step,
    myType,
    preferredType,
    handleMyTypeSelect,
    handlePreferredTypeSelect,
    handleNextStep,
  }
}
