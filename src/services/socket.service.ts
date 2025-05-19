import { io, Socket } from 'socket.io-client'
import { userAtom } from '../atoms/userAtom'
import { API_BASE_URL, SOCKET_URL } from '../config/api'
import { getRecoil } from 'recoil-nexus'

class SocketService {
  private socket: Socket | null = null
  private isConnected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private reconnectInterval = 2000
  private reconnectTimer: NodeJS.Timeout | null = null
  private roomJoined: string | null = null
  private eventListeners: Record<string, Array<(data: any) => void>> = {}

  connect(user?: any) {
    if (this.isConnected && this.socket) {
      console.log('[Socket] 이미 연결되어 있습니다.')
      return this.socket
    }
    // 재연결 시도 중인 타이머가 있다면 정리
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    try {
      // localStorage에서 토큰 직접 가져오기
      const token = localStorage.getItem('token')

      if (!token) {
        console.error('[Socket] 토큰이 없어 소켓 연결을 할 수 없습니다.')
        return null
      }

      // 두 가지 방법으로 사용자 ID 가져오기 시도
      let userId

      // 1. Recoil 상태에서 가져오기 시도
      try {
        const userRecoilState = getRecoil(userAtom)
        if (userRecoilState && userRecoilState.id) {
          userId = userRecoilState.id
          console.log('[Socket] Recoil에서 사용자 ID 가져옴:', userId)
        }
      } catch (recoilError) {
        console.warn(
          '[Socket] Recoil에서 사용자 정보를 가져오는데 실패:',
          recoilError,
        )
      }

      // 2. localStorage에서 가져오기 시도 (백업 방법)
      if (!userId) {
        try {
          const userStr = localStorage.getItem('user')
          if (userStr) {
            const userData = JSON.parse(userStr)
            userId = userData?.id
            console.log('[Socket] localStorage에서 사용자 ID 가져옴:', userId)
          }
        } catch (parseError) {
          console.error(
            '[Socket] localStorage에서 사용자 정보 파싱 실패:',
            parseError,
          )
        }
      }

      // 사용자 ID가 없으면 연결 실패
      if (!userId) {
        console.error(
          '[Socket] 사용자 ID를 찾을 수 없어 소켓 연결을 할 수 없습니다.',
        )
        return null
      }

      this.socket = io(`${SOCKET_URL}/delivery`, {
        auth: {
          token: token,
          userId: userId,
        },
        transports: ['websocket', 'polling'], // 폴링도 추가하여 연결 안정성 향상
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 10000, // 타임아웃 증가
      })

      this.socket.on('connect', () => {
        console.log(
          '[Socket] 서버에 연결되었습니다. 연결 ID:',
          this.socket?.id as string,
        )
        this.isConnected = true
        this.reconnectAttempts = 0 // 재연결 시도 카운터 초기화

        // 이전에 등록된 이벤트 리스너 복구
        this.restoreEventListeners()

        // 이전에 조인한 방이 있으면 자동으로 재조인
        if (this.roomJoined) {
          console.log(`[Socket] 이전 방 자동 재입장: ${this.roomJoined}`)
          this.emit('joinRoom', { deliveryRoomId: this.roomJoined })
        }
      })

      this.socket.on('disconnect', (reason) => {
        console.log(`[Socket] 서버 연결이 끊어졌습니다. 이유: ${reason}`)
        this.isConnected = false

        if (reason === 'io server disconnect' || reason === 'transport close') {
          // 서버에서 강제로 연결을 끊은 경우 또는 네트워크 문제로 자동 재연결 시도
          this.attemptReconnect()
        }
      })

      this.socket.on('connect_error', (error) => {
        console.error('[Socket] 연결 오류:', error)
        this.isConnected = false
        this.attemptReconnect()
      })

      return this.socket
    } catch (error) {
      console.error('[Socket] 소켓 초기화 중 오류:', error)
      return null
    }
  }

  disconnect() {
    if (this.socket) {
      // 모든 이벤트 리스너 제거
      for (const event in this.eventListeners) {
        // 전체 이벤트 제거 - 리스너 개별 제거 대신
        this.socket?.off(event)
      }
      this.eventListeners = {}

      this.socket.disconnect()
      this.isConnected = false
      this.socket = null
      this.roomJoined = null

      // 재연결 타이머가 있다면 정리
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }
    }
  }

  // 방에 조인하는 특수 메소드 (상태 저장 및 관리)
  joinRoom(roomId: string) {
    if (!roomId) {
      console.error('[Socket] 유효하지 않은 방 ID')
      return false
    }

    // 방 ID 저장 (재연결 시 자동 재입장용)
    this.roomJoined = roomId

    // 소켓이 연결되어 있지 않으면 연결 시도
    if (!this.isConnected || !this.socket) {
      console.log('[Socket] 방 입장 전 소켓 연결 시도...')
      this.connect()
    }

    if (this.isConnected && this.socket) {
      // 소켓 이벤트 발생
      this.emit('joinRoom', { deliveryRoomId: roomId })
      console.log(`[Socket] 방 입장 요청 전송: ${roomId}`)
      return true
    } else {
      console.error('[Socket] 소켓 연결 실패로 방 입장 불가')
      return false
    }
  }

  // 재연결 시도 메소드
  private attemptReconnect() {
    if (this.reconnectTimer) return // 이미 재연결 시도 중

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[Socket] 최대 재연결 시도 횟수 초과')
      return
    }

    this.reconnectAttempts++
    console.log(
      `[Socket] 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`,
    )

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect() // 재연결 시도
    }, this.reconnectInterval)
  }

  // 등록된 이벤트 리스너 복구
  private restoreEventListeners() {
    if (!this.socket) return

    // 저장된 모든 이벤트 리스너 복구
    for (const event in this.eventListeners) {
      this.eventListeners[event].forEach((callback) => {
        this.socket?.on(event, callback)
        console.log(`[Socket] '${event}' 이벤트 리스너 복구 완료`)
      })
    }
  }

  emit(event: string, data: any, callback?: (response: any) => void) {
    if (!this.socket || !this.isConnected) {
      console.log(
        '[Socket] 소켓이 초기화되지 않았거나 연결되지 않았습니다. 재연결 시도...',
      )
      this.connect()

      if (!this.socket || !this.isConnected) {
        console.error(
          '[Socket] 재연결 실패. 이벤트 전송을 큐에 저장하거나 다시 시도해야 합니다:',
          event,
        )
        return
      }
    }

    // 방 이벤트인 경우 방 ID 저장
    if (event === 'joinRoom' && data && data.deliveryRoomId) {
      this.roomJoined = data.deliveryRoomId
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
    return this.isConnected && this.socket !== null
  }

  on(event: string, callback: (data: any) => void) {
    // 소켓이 없으면 자동으로 연결 시도
    if (!this.socket) {
      console.log('[Socket] 소켓이 초기화되지 않아 연결을 시도합니다.')
      this.connect()

      if (!this.socket) {
        console.error(
          '[Socket] 소켓 연결 실패. 이벤트 리스너를 등록할 수 없습니다.',
        )
        return
      }
    }

    // 이벤트 리스너를 등록하고 내부 관리 목록에 추가
    this.socket.on(event, callback)

    // 이벤트 리스너 관리 (재연결 시 복구용)
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)
    console.log(`[Socket] '${event}' 이벤트 리스너 등록 완료`)
  }

  off(event: string) {
    if (!this.socket) {
      console.error('[Socket] 소켓이 초기화되지 않았습니다.')
      return
    }

    // 소켓에서 이벤트 리스너 제거
    this.socket.off(event)

    // 내부 관리 목록에서도 제거
    if (this.eventListeners[event]) {
      delete this.eventListeners[event]
      console.log(`[Socket] '${event}' 이벤트 리스너 제거 완료`)
    }
  }

  getSocket() {
    return this.socket
  }

  isConnectedToServer() {
    return this.isConnected && this.socket !== null && this.socket.connected
  }

  // 현재 참여 중인 방 ID 반환
  getCurrentRoom() {
    return this.roomJoined
  }
}

// 싱글턴 인스턴스 생성
const socketService = new SocketService()
export default socketService
