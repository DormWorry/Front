import axios from 'axios'
import {
  RoommateProfile,
  RoommateType,
  CreateRoommateProfileDto,
} from '../pages/matching/types'

// 임시 해결책: roommate API만 로컬 서버로 리다이렉트
const API_URL = 'http://localhost:3001'

// 룸메이트 프로필 API 서비스
const roommateApi = {
  // 내 프로필 조회
  getMyProfile: async (): Promise<RoommateProfile> => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/roommate-profiles/user/me`, {
        withCredentials: true,
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
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/roommate-profiles`,
        profileData,
        {
          withCredentials: true,
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
      const token = localStorage.getItem('token')
      const response = await axios.patch(
        `${API_URL}/roommate-profiles/${id}`,
        profileData,
        {
          withCredentials: true,
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
        { withCredentials: true }
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
      const response = await axios.get(`${API_URL}/roommate-profiles/${id}`, { withCredentials: true })
      return response.data
    } catch (error) {
      console.error('프로필 상세 조회 실패:', error)
      throw error
    }
  },

  // 프로필 삭제 (비활성화)
  deleteProfile: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/roommate-profiles/${id}`, {
        withCredentials: true,
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
