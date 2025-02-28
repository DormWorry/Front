import { useState } from 'react'
import { RoommateType } from '../pages/matching/types'

interface UseStepReturn {
  step: 1 | 2 | 3
  myType: RoommateType | null
  preferredType: RoommateType | null
  handleMyTypeSelect: (type: RoommateType) => void
  handlePreferredTypeSelect: (type: RoommateType) => void
  handleNextStep: (onComplete: (type: RoommateType) => void) => void
  handlePrevStep: () => void
  goToStep: (targetStep: 1 | 2 | 3) => void
}

export const useStep = (): UseStepReturn => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
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
      setStep(3)
      onComplete(preferredType)
    }
  }

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1)
    } else if (step === 3) {
      setStep(2)
    }
  }

  const goToStep = (targetStep: 1 | 2 | 3) => {
    if (
      targetStep < step &&
      ((targetStep === 1 && myType) || (targetStep === 2 && preferredType))
    ) {
      setStep(targetStep)
    }
  }

  return {
    step,
    myType,
    preferredType,
    handleMyTypeSelect,
    handlePreferredTypeSelect,
    handleNextStep,
    handlePrevStep,
    goToStep,
  }
}
