// 배달방 상태 열거형
export enum DeliveryRoomStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  COMPLETED = 'completed',
}

// 사용자 타입
export interface User {
  id: string
  nickname: string
  email?: string
  profileImage?: string
}

// 배달 참가자 타입
export interface DeliveryParticipant {
  id: string
  userId: string
  deliveryRoomId: string
  orderDetails: string
  amount: number
  isPaid: boolean
  joinedAt: Date
  user?: User
}

// 채팅 메시지 타입
export interface ChatMessage {
  id: string
  userId: string
  deliveryRoomId: string
  message: string
  createdAt: Date
  user?: User
}
