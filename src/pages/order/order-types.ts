export interface ParticipantType {
  id: string;
  name: string;
  avatar?: string;
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
  senderName: string;
  content: string;
  timestamp: string;
}

export interface FoodCategoryType {
  id: string;
  name: string;
  icon: string;
}
