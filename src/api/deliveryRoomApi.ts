import axiosInstance from './axios'
import { FoodCategory } from '../constants/category'
import { DeliveryRoomStatus } from '../types/delivery'

// DeliveryRoom 타입 정의
export interface DeliveryRoom {
  id: string
  creatorId: string
  restaurantName: string
  category: string
  minimumOrderAmount: number
  deliveryFee: number
  description: string
  status: DeliveryRoomStatus
  orderedAt?: Date
  createdAt: Date
  updatedAt: Date
  creator?: any
  participants?: any[]
}

// DeliveryRoom 생성 데이터 타입
export interface CreateDeliveryRoomDto {
  restaurantName: string
  category: string
  minimumOrderAmount: number
  deliveryFee: number
  description: string
}

// DeliveryRoom 필터 타입
export interface FilterDeliveryRoomDto {
  category?: string
  status?: DeliveryRoomStatus
}

// DeliveryRoom API 서비스
const deliveryRoomApi = {
  // 배달 방 생성
  createRoom: async (data: CreateDeliveryRoomDto): Promise<DeliveryRoom> => {
    const response = await axiosInstance.post('/delivery-rooms', data)
    return response.data
  },

  // 모든 배달 방 조회 (필터링 가능)
  getAllRooms: async (
    filters: FilterDeliveryRoomDto = {},
  ): Promise<DeliveryRoom[]> => {
    const response = await axiosInstance.get('/delivery-rooms', {
      params: filters,
    })
    return response.data
  },

  // 카테고리별 배달 방 조회
  getRoomsByCategory: async (category: string): Promise<DeliveryRoom[]> => {
    const response = await axiosInstance.get(
      `/delivery-rooms/categories/${category}`,
    )
    return response.data
  },

  // 카테고리 목록 조회
  getAllCategories: async (): Promise<{ key: string; name: string }[]> => {
    const response = await axiosInstance.get('/delivery-rooms/categories')
    return response.data
  },

  // 내가 생성한 배달 방 조회
  getMyRooms: async (): Promise<DeliveryRoom[]> => {
    const response = await axiosInstance.get('/delivery-rooms/my-rooms')
    return response.data
  },

  // 내가 참여중인 배달 방 조회
  getParticipatingRooms: async (): Promise<DeliveryRoom[]> => {
    const response = await axiosInstance.get('/delivery-rooms/participating')
    return response.data
  },

  // 특정 배달 방 조회
  getRoomById: async (id: string): Promise<DeliveryRoom> => {
    const response = await axiosInstance.get(`/delivery-rooms/${id}`)
    return response.data
  },

  // 배달 방 상태 변경
  updateRoomStatus: async (
    id: string,
    status: DeliveryRoomStatus,
  ): Promise<DeliveryRoom> => {
    const response = await axiosInstance.patch(`/delivery-rooms/${id}/status`, {
      status,
    })
    return response.data
  },

  // 배달 방 삭제
  deleteRoom: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/delivery-rooms/${id}`)
  },
}

export default deliveryRoomApi
