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

/**
 * 문자열을 타이핑 효과로 표시하는 커스텀 훅
 * @param text 타이핑할 텍스트
 * @param typingSpeed 타이핑 속도 (ms)
 * @param completionTriggerPercentage 타이핑 완료로 간주할 비율 (0.0-1.0)
 */
const useTypingAnimation = ({
  text,
  typingSpeed = 50,
  completionTriggerPercentage = 0.7,
}: UseTypingAnimationProps): UseTypingAnimationReturn => {
  const [typedText, setTypedText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [hasStartedTyping, setHasStartedTyping] = useState(false)

  // 타이핑 시작 설정
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStartedTyping(true)
    }, 100)

    return () => clearTimeout(startTimer)
  }, [])

  // 타이핑 애니메이션
  useEffect(() => {
    if (!hasStartedTyping) return

    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setTypedText(text.substring(0, currentIndex + 1))
        currentIndex++

        // 일정 비율까지 타이핑되면 완료 상태로 설정
        if (currentIndex > text.length * completionTriggerPercentage) {
          setIsTypingComplete(true)
        }
      } else {
        clearInterval(typingInterval)
        setIsTypingComplete(true)
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [hasStartedTyping, text, completionTriggerPercentage, typingSpeed])

  return { typedText, isTypingComplete }
}

export default useTypingAnimation
