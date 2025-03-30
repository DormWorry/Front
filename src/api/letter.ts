import axios from 'axios'

// 백엔드 API URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// 편지 데이터 타입 정의
export interface Letter {
  id: number
  title: string
  content: string
  senderRoomNumber: string
  senderName: string
  recipientRoomNumber: string
  recipientName: string
  isAnonymous: boolean
  createdAt: string
  updatedAt: string
}

// 편지 목록 응답 타입 정의
export interface LetterListResponse {
  data: Letter[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// 편지 작성 데이터 타입 정의
export interface LetterData {
  title: string
  content: string
  to: string // 받는 사람 방 번호
  isAnonymous?: boolean
}

// 편지 API 함수 모음
const letterApi = {
  // 받은 편지 목록 조회
  getReceivedLetters: async (page = 1, limit = 10): Promise<LetterListResponse> => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('인증 토큰이 없습니다.')
      }

      const response = await axios.get(`${API_BASE_URL}/letters/received`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit,
        },
      })

      return response.data
    } catch (error) {
      console.error('받은 편지 목록 조회 실패:', error)
      throw error
    }
  },

  // 보낸 편지 목록 조회
  getSentLetters: async (page = 1, limit = 10): Promise<LetterListResponse> => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('인증 토큰이 없습니다.')
      }

      const response = await axios.get(`${API_BASE_URL}/letters/sent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit,
        },
      })

      return response.data
    } catch (error) {
      console.error('보낸 편지 목록 조회 실패:', error)
      throw error
    }
  },

  // 편지 상세 조회
  getLetterDetail: async (letterId: number): Promise<Letter> => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('인증 토큰이 없습니다.')
      }

      const response = await axios.get(`${API_BASE_URL}/letters/${letterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    } catch (error) {
      console.error('편지 상세 조회 실패:', error)
      throw error
    }
  },

  // 편지 전송
  sendLetter: async (letterData: LetterData): Promise<Letter> => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('인증 토큰이 없습니다.')
      }

      const response = await axios.post(
        `${API_BASE_URL}/letters`,
        {
          title: letterData.title,
          content: letterData.content,
          recipientRoomNumber: letterData.to,
          isAnonymous: letterData.isAnonymous || false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      return response.data
    } catch (error) {
      console.error('편지 전송 실패:', error)
      throw error
    }
  },
}

export default letterApi
