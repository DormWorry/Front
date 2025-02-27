import { useState, useEffect } from 'react'

interface UseTypingAnimationProps {
  text: string
  typingSpeed?: number
  completionTriggerPercentage?: number
}

interface UseTypingAnimationReturn {
  typedText: string
  isTypingComplete: boolean
}

const useTypingAnimation = ({
  text,
  typingSpeed = 50,
  completionTriggerPercentage = 1.0,
}: UseTypingAnimationProps): UseTypingAnimationReturn => {
  const [typedText, setTypedText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setTypedText(text.substring(0, currentIndex + 1))
        currentIndex++
        if (currentIndex > text.length * completionTriggerPercentage) {
          setIsTypingComplete(true)
        }
      } else {
        clearInterval(typingInterval)
        setIsTypingComplete(true)
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [text, completionTriggerPercentage, typingSpeed])

  return { typedText, isTypingComplete }
}

export default useTypingAnimation
