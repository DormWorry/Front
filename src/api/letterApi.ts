import axios from 'axios'
import { Letter, LetterFormData } from '../pages/letter/types'
import { API_BASE_URL } from '../config/api'

// API 기본 URL 설정 - 중앙 관리되는 URL 사용

// 편지 API 클라이언트
const letterApi = {
  // 받은 편지함 조회
  async getReceivedLetters(roomNumber: string, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/letters/received`, {
        withCredentials: true,
        params: { roomNumber, page, limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('받은 편지함 조회 실패:', error)
      throw error
    }
  },

  // 보낸 편지함 조회
  async getSentLetters(roomNumber: string, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/letters/sent`, {
        withCredentials: true,
        params: { roomNumber, page, limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('보낸 편지함 조회 실패:', error)
      throw error
    }
  },

  // 편지 상세 조회
  async getLetter(id: string, roomNumber: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/letters/${id}`, {
        withCredentials: true,
        params: { roomNumber },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('편지 상세 조회 실패:', error)
      throw error
    }
  },

  // 편지 전송
  async sendLetter(letterData: LetterFormData) {
    try {
      const payload = {
        title: letterData.title,
        content: letterData.content,
        senderRoomNumber: letterData.sender,
        senderName: '권도훈', // 현재 사용자 이름 (추후 로그인 사용자 정보에서 가져오기)
        recipientRoomNumber: letterData.recipient,
        isAnonymous: false, // 추후 익명 옵션 추가 필요
      }

      const response = await axios.post(`${API_BASE_URL}/letters`, payload, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {
      console.error('편지 전송 실패123:', error)
      throw error
    }
  },
}

export default letterApi
