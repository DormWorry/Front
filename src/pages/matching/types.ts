export interface QuestionData {
  answer: string
  error: string
}

export interface CardContact {
  kakaoId: string
  instagram: string
  location: string
}

export interface CardData {
  id: number
  name: string
  role: string
  image: string
  description: string
  contact: CardContact
  personalityTypeId: number
}

export interface RoommateType {
  id: number
  title: string
  traits: string[]
  description: string
  emoji: string
}

export interface UserInfo {
  kakaoId: string
  instagram: string
  description: string
  location: '1기숙사' | '2기숙사' | '3기숙사'
}
