import { API_BASE_URL } from '../config/api';
import axios from 'axios';
import { OrderRoomType, ParticipantType } from '../pages/order/order-types';

// Auth 헤더 설정을 위한 인터셉터 추가
const apiInstance = axios.create({
  baseURL: `${API_BASE_URL}`,
  timeout: 15000,
});

apiInstance.interceptors.request.use((config) => {
  // localStorage에서 토큰을 직접 가져옴
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 배달 주문방 관련 API 서비스
const deliveryRoomApi = {
  // 주문방 목록 가져오기
  getRooms: async (category?: string): Promise<OrderRoomType[]> => {
    try {
      const queryParam = category ? `?category=${category}` : '';
      const response = await apiInstance.get(`/delivery-room${queryParam}`);
      
      // 서버 응답 데이터를 프론트엔드 타입으로 변환
      return response.data.map((room: any) => ({
        id: room.id,
        restaurantName: room.restaurantName,
        minOrderAmount: room.minimumOrderAmount,
        deliveryFee: room.deliveryFee,
        categoryId: room.category,
        participants: room.participants.map((p: any) => ({
          id: p.user.id,
          name: p.user.name || p.user.nickname || '익명',
          avatar: p.user.profileImage,
        })),
        createdAt: room.createdAt,
        createdBy: room.creatorId,
        description: room.description,
      }));
    } catch (error) {
      console.error('주문방 목록 가져오기 오류:', error);
      return [];
    }
  },

  // 주문방 상세 정보 가져오기
  getRoom: async (roomId: string): Promise<OrderRoomType | null> => {
    try {
      const response = await apiInstance.get(`/delivery-room/${roomId}`);
      const room = response.data;
      
      return {
        id: room.id,
        restaurantName: room.restaurantName,
        minOrderAmount: room.minimumOrderAmount,
        deliveryFee: room.deliveryFee,
        categoryId: room.category,
        participants: room.participants.map((p: any) => ({
          id: p.user.id,
          name: p.user.name || p.user.nickname || '익명',
          avatar: p.user.profileImage,
        })),
        createdAt: room.createdAt,
        createdBy: room.creatorId,
        description: room.description,
      };
    } catch (error) {
      console.error('주문방 상세 정보 가져오기 오류:', error);
      return null;
    }
  },

  // 주문방 생성하기
  createRoom: async (roomData: {
    restaurantName: string;
    category: string;
    minimumOrderAmount: number;
    deliveryFee: number;
    description?: string;
  }): Promise<OrderRoomType | null> => {
    try {
      const response = await apiInstance.post('/delivery-room', roomData);
      const room = response.data;
      
      // localStorage에서 토큰을 처리하는 패턴으로 변경
      // 클라이언트에서 호출 시 사용자 정보를 매개변수로 넘기도록 수정
      const participant: ParticipantType = {
        id: '',  // 사용자 ID 추가 필요
        name: '익명', // 사용자 이름 추가 필요
      };
      
      return {
        id: room.id,
        restaurantName: room.restaurantName,
        minOrderAmount: room.minimumOrderAmount,
        deliveryFee: room.deliveryFee,
        categoryId: room.category,
        participants: [participant],
        createdAt: room.createdAt,
        createdBy: room.creatorId,
        description: room.description,
      };
    } catch (error) {
      console.error('주문방 생성 오류:', error);
      return null;
    }
  },

  // 참여자로 주문방 참여하기
  joinRoom: async (roomId: string, orderDetails?: string, amount?: number): Promise<boolean> => {
    try {
      await apiInstance.post('/delivery-participant/join', {
        deliveryRoomId: roomId,
        orderDetails,
        amount,
      });
      return true;
    } catch (error: any) {
      console.error('주문방 참여 오류:', error);
      
      // 409 Conflict 오류는 이미 참여한 경우이므로 성공으로 처리
      if (error.response && error.response.status === 409) {
        console.log('이미 참여 중인 방입니다. 참여 성공으로 처리합니다.');
        return true;
      }
      return false;
    }
  },

  // 주문방 나가기
  leaveRoom: async (roomId: string): Promise<boolean> => {
    try {
      await apiInstance.delete(`/delivery-participant/${roomId}/leave`);
      return true;
    } catch (error) {
      console.error('주문방 나가기 오류:', error);
      return false;
    }
  },

  // 주문 정보 업데이트
  updateOrderDetails: async (roomId: string, orderDetails: string, amount: number): Promise<boolean> => {
    try {
      await apiInstance.patch(`/delivery-participant/${roomId}/update-order`, {
        orderDetails,
        amount,
      });
      return true;
    } catch (error) {
      console.error('주문 정보 업데이트 오류:', error);
      return false;
    }
  },

  // 주문방 채팅 메시지 가져오기
  getMessages: async (roomId: string) => {
    try {
      const response = await apiInstance.get(`/delivery-chat/${roomId}`);
      return response.data.map((msg: any) => ({
        id: msg.id,
        senderId: msg.userId,
        senderName: msg.user.name || msg.user.nickname || '익명',
        content: msg.message,
        timestamp: msg.createdAt,
      }));
    } catch (error) {
      console.error('채팅 메시지 가져오기 오류:', error);
      return [];
    }
  },

  // 주문방 채팅 메시지 전송하기
  sendMessage: async (roomId: string, message: string) => {
    try {
      const response = await apiInstance.post(`/delivery-chat/${roomId}`, {
        message,
      });
      return response.data;
    } catch (error) {
      console.error('채팅 메시지 전송 오류:', error);
      return null;
    }
  },
};

export default deliveryRoomApi;
