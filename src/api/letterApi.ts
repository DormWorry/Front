import axios from 'axios'
import { Letter, LetterFormData } from '../pages/letter/types'

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// 편지 API 클라이언트
const letterApi = {
  // 받은 편지함 조회
  async getReceivedLetters(roomNumber: string, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/letters/received`, {
        params: { roomNumber, page, limit },
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
        params: { roomNumber, page, limit },
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
        params: { roomNumber },
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

      const response = await axios.post(`${API_BASE_URL}/letters`, payload)
      return response.data
    } catch (error) {
      console.error('편지 전송 실패:', error)
      throw error
    }
  },
}

export default letterApi
