import axiosInstance from './axios'
import { DeliveryParticipant } from '../types/delivery'

// 배달 방 참가 데이터 타입
export interface CreateDeliveryParticipantDto {
  deliveryRoomId: string
  orderDetails: string
  amount: number
}

// DeliveryParticipant API 서비스
const deliveryParticipantApi = {
  // 배달 방 참가
  joinRoom: async (
    data: CreateDeliveryParticipantDto,
  ): Promise<DeliveryParticipant> => {
    const response = await axiosInstance.post('/delivery-participants', data)
    return response.data
  },

  // 특정 방의 모든 참가자 조회
  getParticipantsByRoomId: async (
    roomId: string,
  ): Promise<DeliveryParticipant[]> => {
    const response = await axiosInstance.get(
      `/delivery-participants/room/${roomId}`,
    )
    return response.data
  },

  // 특정 참가자 조회
  getParticipantById: async (id: string): Promise<DeliveryParticipant> => {
    const response = await axiosInstance.get(`/delivery-participants/${id}`)
    return response.data
  },

  // 참가자 정보 수정
  updateParticipant: async (
    id: string,
    updateData: Partial<DeliveryParticipant>,
  ): Promise<DeliveryParticipant> => {
    const response = await axiosInstance.patch(
      `/delivery-participants/${id}`,
      updateData,
    )
    return response.data
  },

  // 참가자 결제 상태 토글
  togglePaymentStatus: async (id: string): Promise<DeliveryParticipant> => {
    const response = await axiosInstance.patch(
      `/delivery-participants/${id}/payment`,
      {},
    )
    return response.data
  },

  // 배달 방 나가기
  leaveRoom: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/delivery-participants/${id}`)
  },
}

export default deliveryParticipantApi
