import axios from 'axios'
import {
  RoommateProfile,
  RoommateType,
  CreateRoommateProfileDto,
} from '../pages/matching/types'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

// 룸메이트 프로필 API 서비스
const roommateApi = {
  // 내 프로필 조회
  getMyProfile: async (): Promise<RoommateProfile> => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/roommate-profiles/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('내 프로필 조회 실패:', error)
      throw error
    }
  },

  // 프로필 등록
  createProfile: async (
    profileData: CreateRoommateProfileDto,
  ): Promise<RoommateProfile> => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.post(
        `${API_URL}/roommate-profiles`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      return response.data
    } catch (error) {
      console.error('프로필 등록 실패:', error)
      throw error
    }
  },

  // 프로필 수정
  updateProfile: async (
    id: string,
    profileData: Partial<CreateRoommateProfileDto>,
  ): Promise<RoommateProfile> => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.patch(
        `${API_URL}/roommate-profiles/${id}`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      return response.data
    } catch (error) {
      console.error('프로필 수정 실패:', error)
      throw error
    }
  },

  // 전체 프로필 조회 (필터 및 정렬 적용)
  getProfiles: async (filters?: {
    myPersonalityTypeId?: number
    preferredPersonalityTypeId?: number
    dormitoryId?: string
    preferredType?: number // 선호하는 성격 유형으로 정렬
  }): Promise<RoommateProfile[]> => {
    try {
      const queryParams = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString())
          }
        })
      }

      const response = await axios.get(
        `${API_URL}/roommate-profiles?${queryParams.toString()}`,
      )
      return response.data
    } catch (error) {
      console.error('프로필 목록 조회 실패:', error)
      throw error
    }
  },

  // 프로필 상세 조회
  getProfileById: async (id: string): Promise<RoommateProfile> => {
    try {
      const response = await axios.get(`${API_URL}/roommate-profiles/${id}`)
      return response.data
    } catch (error) {
      console.error('프로필 상세 조회 실패:', error)
      throw error
    }
  },

  // 프로필 삭제 (비활성화)
  deleteProfile: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.delete(`${API_URL}/roommate-profiles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error('프로필 삭제 실패:', error)
      throw error
    }
  },
}

export default roommateApi
