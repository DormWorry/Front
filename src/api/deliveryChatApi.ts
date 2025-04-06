import { io, Socket } from 'socket.io-client'
import { ChatMessage } from '../types/delivery'

// 웹소켓 기본 URL 설정
const SOCKET_BASE_URL =
  process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001'

class DeliveryChatService {
  private socket: Socket | null = null
  private token: string | null = null

  // 웹소켓 연결
  connect() {
    if (!this.socket) {
      this.token = localStorage.getItem('token')
      this.socket = io(`${SOCKET_BASE_URL}/delivery-chat`, {
        auth: {
          token: this.token,
        },
      })

      // 연결 이벤트 핸들러
      this.socket.on('connect', () => {
        console.log('Delivery chat socket connected')
      })

      // 연결 오류 이벤트 핸들러
      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error)
      })
    }
    return this.socket
  }

  // 웹소켓 연결 해제
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // 방 입장
  joinRoom(roomId: string, callback?: (messages: ChatMessage[]) => void) {
    const socket = this.connect()
    socket.emit('joinRoom', { roomId })

    // 이전 채팅 기록 받기
    if (callback) {
      socket.on('chatHistory', callback)
    }
  }

  // 방 퇴장
  leaveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('leaveRoom', { roomId })
    }
  }

  // 메시지 전송
  sendMessage(roomId: string, message: string) {
    if (this.socket) {
      this.socket.emit('sendMessage', { roomId, message })
    }
  }

  // 방 참여자 목록 요청
  getRoomUsers(
    roomId: string,
    callback: (data: { roomId: string; users: any[] }) => void,
  ) {
    if (this.socket) {
      this.socket.emit('getRoomUsers', { roomId })
      this.socket.on('roomUsers', callback)
    }
  }

  // 새 메시지 수신 이벤트 리스너 등록
  onNewMessage(callback: (message: ChatMessage) => void) {
    if (this.socket) {
      this.socket.on('newMessage', callback)
    }
  }

  // 사용자 입장 이벤트 리스너 등록
  onUserJoined(callback: (data: { userId: string; nickname: string }) => void) {
    if (this.socket) {
      this.socket.on('userJoined', callback)
    }
  }

  // 사용자 퇴장 이벤트 리스너 등록
  onUserLeft(callback: (data: { userId: string; nickname: string }) => void) {
    if (this.socket) {
      this.socket.on('userLeft', callback)
    }
  }

  // 에러 이벤트 리스너 등록
  onError(callback: (data: { message: string }) => void) {
    if (this.socket) {
      this.socket.on('error', callback)
    }
  }

  // 이벤트 리스너 제거
  offEvent(eventName: string) {
    if (this.socket) {
      this.socket.off(eventName)
    }
  }
}

// 싱글톤 인스턴스 생성
const deliveryChatService = new DeliveryChatService()

export default deliveryChatService
