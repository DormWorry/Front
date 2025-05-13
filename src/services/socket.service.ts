import { io, Socket } from 'socket.io-client'
import { userAtom } from '../atoms/userAtom'
import { API_BASE_URL, SOCKET_URL } from '../config/api'
import { getRecoil } from 'recoil-nexus'

class SocketService {
  private socket: Socket | null = null
  private isConnected = false

  connect(user?: any) {
    if (this.isConnected && this.socket) {
      console.log('[Socket] 이미 연결되어 있습니다.');
      return this.socket;
    }

    try {
      // localStorage에서 토큰 직접 가져오기
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('[Socket] 토큰이 없어 소켓 연결을 할 수 없습니다.');
        return null;
      }

      // 두 가지 방법으로 사용자 ID 가져오기 시도
      let userId;
      
      // 1. Recoil 상태에서 가져오기 시도
      try {
        const userRecoilState = getRecoil(userAtom);
        if (userRecoilState && userRecoilState.id) {
          userId = userRecoilState.id;
          console.log('[Socket] Recoil에서 사용자 ID 가져옴:', userId);
        }
      } catch (recoilError) {
        console.warn('[Socket] Recoil에서 사용자 정보를 가져오는데 실패:', recoilError);
      }
      
      // 2. localStorage에서 가져오기 시도 (백업 방법)
      if (!userId) {
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const userData = JSON.parse(userStr);
            userId = userData?.id;
            console.log('[Socket] localStorage에서 사용자 ID 가져옴:', userId);
          }
        } catch (parseError) {
          console.error('[Socket] localStorage에서 사용자 정보 파싱 실패:', parseError);
        }
      }
      
      // 사용자 ID가 없으면 연결 실패
      if (!userId) {
        console.error('[Socket] 사용자 ID를 찾을 수 없어 소켓 연결을 할 수 없습니다.');
        return null;
      }
      
      this.socket = io(`${SOCKET_URL}/delivery`, {
        auth: {
          token: token,
          userId: userId,
        },
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      this.socket.on('connect', () => {
        console.log('[Socket] 서버에 연결되었습니다. 연결 ID:', this.socket?.id as string)
        this.isConnected = true
      })

      this.socket.on('disconnect', () => {
        console.log('[Socket] 서버 연결이 끊어졌습니다.')
        this.isConnected = false
      })

      this.socket.on('connect_error', (error) => {
        console.error('[Socket] 연결 오류:', error)
        this.isConnected = false
      })

      return this.socket
    } catch (error) {
      console.error('[Socket] 소켓 초기화 중 오류:', error)
      return null
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.isConnected = false
      this.socket = null
    }
  }

  emit(event: string, data: any, callback?: (response: any) => void) {
    if (!this.socket) {
      console.error('[Socket] 소켓이 초기화되지 않았습니다. 재연결 시도...')
      this.connect()
      
      if (!this.socket) {
        console.error('[Socket] 재연결 실패. 이벤트 전송 불가:', event)
        return
      }
    }

    try {
      console.log(`[Socket] 이벤트 전송: ${event}`, data)
      if (callback) {
        this.socket.emit(event, data, callback)
      } else {
        this.socket.emit(event, data)
      }
    } catch (err) {
      console.error(`[Socket] 이벤트 전송 오류 (${event}):`, err)
    }
  }
  
  // 소켓 연결 상태 확인 함수 추가
  isSocketConnected() {
    return this.isConnected && this.socket !== null;
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      console.error('[Socket] 소켓이 초기화되지 않았습니다.')
      return
    }

    this.socket.on(event, callback)
  }

  off(event: string) {
    if (!this.socket) {
      console.error('[Socket] 소켓이 초기화되지 않았습니다.')
      return
    }

    this.socket.off(event)
  }

  getSocket() {
    return this.socket
  }

  isConnectedToServer() {
    return this.isConnected
  }
}

// 싱글턴 인스턴스 생성
const socketService = new SocketService()
export default socketService
