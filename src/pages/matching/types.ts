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

// 백엔드 API와 통신을 위한 타입 정의
export interface User {
  id: string
  nickname: string
  email: string
}

export interface RoommateProfile {
  id: string
  userId: string
  user?: User
  myPersonalityTypeId: number
  myPersonalityType?: RoommateType
  preferredPersonalityTypeId: number
  preferredPersonalityType?: RoommateType
  introduction: string
  kakaoTalkId: string
  instagramId: string
  dormitoryId: string
  dormitory?: {
    id: string
    name: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateRoommateProfileDto {
  myPersonalityTypeId: number
  preferredPersonalityTypeId: number
  introduction: string
  kakaoTalkId: string
  instagramId: string
  dormitoryId: string
}
