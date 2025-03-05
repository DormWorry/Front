// 비속어 필터링을 위한 단어 목록
export const profanityList: string[] =
  process.env.NEXT_PUBLIC_PROFANITY_LIST!.split(',')

// 비속어 필터링 우회를 위한 대체 문자 매핑
const characterMapping: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '2': 'z',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '6': 'b',
  '7': 't',
  '8': 'b',
  '9': 'g',
  '@': 'a',
  '$': 's',
  '#': 'h',
  '+': 't',
  '*': 'x',
  '!': 'i',
  '|': 'i',
  '.': '',
  ',': '',
  '_': '',
  '-': '',
  ' ': '',  // 띄어쓰기 제거
  '\t': '', // 탭 제거
  '\n': '', // 줄바꿈 제거
  '\r': '', // 캐리지 리턴 제거
}

/**
 * 텍스트에서 특수문자, 숫자 등을 대체하여 비속어 판별을 위한 정규화된 문자열 반환
 * @param text 원본 텍스트
 * @returns 정규화된 텍스트
 */
const normalizeText = (text: string): string => {
  if (!text) return ''
  
  // 소문자로 변환
  let normalized = text.toLowerCase()
  
  // 모든 문자에 대해 매핑 적용
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i]
    normalized = normalized.substring(0, i) + 
                (characterMapping[char] !== undefined ? characterMapping[char] : char) +
                normalized.substring(i + 1)
  }
  
  return normalized
}

/**
 * 텍스트에 비속어가 포함되어 있는지 정교하게 확인하는 함수
 * @param text 검사할 텍스트
 * @returns 비속어 포함 여부 (true: 포함됨, false: 포함되지 않음)
 */
export const containsProfanity = (text: string): boolean => {
  if (!text) return false

  // 텍스트 정규화 (특수문자, 숫자, 공백 등 제거하고 대체)
  const normalizedText = normalizeText(text)
  
  // 정규화된 텍스트에서 비속어 검사
  return profanityList.some((word) => {
    // 비속어 자체도 정규화
    const normalizedWord = normalizeText(word)
    return normalizedText.includes(normalizedWord)
  })
}

/**
 * 텍스트에서 비속어를 '*'로 마스킹하는 함수
 * @param text 원본 텍스트
 * @returns 비속어가 마스킹된 텍스트
 */
export const maskProfanity = (text: string): string => {
  if (!text) return ''
  
  let maskedText = text
  
  profanityList.forEach(word => {
    // 대소문자 구분없이 전역 매칭을 위한 정규식
    const regex = new RegExp(word, 'gi')
    maskedText = maskedText.replace(regex, '*'.repeat(word.length))
  })
  
  return maskedText
}

/**
 * 텍스트에서 발견된 첫 번째 비속어를 반환하는 함수
 * (비속어가 발견되지 않으면 빈 문자열 반환)
 * @param text 검사할 텍스트
 * @returns 발견된 첫 번째 비속어 또는 빈 문자열
 */
export const findFirstProfanity = (text: string): string => {
  if (!text) return ''
  
  // 텍스트 정규화
  const normalizedText = normalizeText(text)
  
  for (const word of profanityList) {
    const normalizedWord = normalizeText(word)
    if (normalizedText.includes(normalizedWord)) {
      return word
    }
  }
  
  return ''
}
