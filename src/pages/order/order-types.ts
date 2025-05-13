export interface UserType {
  id: number;
  kakaoId: string;
  nickname: string;
  email?: string;
  studentId?: string;
  profileImage?: string;
}

export interface ParticipantType {
  id: string;
  userId: number;
  deliveryRoomId: string;
  joinedAt: string;
  isPaid: boolean;
  amount: number;
  orderDetails: string;
  // 두 가지 데이터 구조 모두 지원 (후방호환성)
  name?: string;        // 이전 API 구조
  avatar?: string;      // 이전 API 구조
  user?: UserType;      // 새로운 중첩된 구조
}

export interface OrderRoomType {
  id: string;
  restaurantName: string;
  minOrderAmount: number;
  deliveryFee: number;
  categoryId: string;
  participants: ParticipantType[];
  createdAt: string;
  createdBy: string;
  description?: string;
}

export interface MessageType {
  id: string;
  senderId: string;
  senderName?: string; // 선택적 속성으로 변경 - 서버에서 채워질 수 있음
  content: string;
  timestamp: string;
  roomId?: string; // 임시 메시지 처리를 위해 추가
}

export interface FoodCategoryType {
  id: string;
  name: string;
  icon: string;
}
