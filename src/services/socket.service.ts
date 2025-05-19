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
      // 브라우저 환경인지 확인
      if (typeof window === 'undefined') {
        console.log('[Socket] 서버사이드 렌더링 환경에서는 소켓 연결을 스킵합니다.')
        return null
      }

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

      // 상대 URL 사용 (백엔드 서버가 이미 SOCKET_URL에 포함됨)
      console.log(`[Socket] 연결 시도 - URL: ${SOCKET_URL}, 사용자 ID: ${userId}`);
      
      try {
        // 연결 실패를 대비해 클라우드타입 URL에서 직접 연결 시도
        this.socket = io(SOCKET_URL, {
          auth: {
            token: token,
            userId: userId,
          },
          transports: ['polling', 'websocket'], // polling을 먼저 시도하고 websocket으로 업그레이드하도록 변경
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
          timeout: 30000, // 타임아웃 더 증가 (30초)
          forceNew: true, // 새로운 연결 생성 강제 (기존 연결이 있더라도)
          path: '/socket.io' // 기본 경로 명시적 지정
        });
        
        console.log('[Socket] 소켓 객체 생성 성공');
      } catch (err) {
        console.error('[Socket] 소켓 객체 생성 중 오류:', err);
        this.isConnected = false;
        return null;
      }

      this.socket.on('connect', () => {
        console.log(
          '[Socket] 서버에 연결되었습니다. 연결 ID:',
          this.socket?.id as string,
        )
        this.isConnected = true
        this.reconnectAttempts = 0 // 재연결 시도 카운터 초기화

        // 이전에 등록된 이벤트 리스너 복구
        this.restoreEventListeners()

        // 소켓에 연결되었으니 즉시 new_message 이벤트 등록
        console.log('[Socket] new_message 이벤트 등록 시도')
        this.socket?.on('new_message', (data) => {
          console.log('[Socket] 새 메시지 이벤트 수신:', data)
          // 이벤트 리스너에서 처리하도록 통지
          if (this.eventListeners['new_message']) {
            this.eventListeners['new_message'].forEach(callback => {
              callback(data)
            })
          }
        })

        // 이전에 조인한 방이 있으면 자동으로 재조인
        if (this.roomJoined) {
          console.log(`[Socket] 이전 방 자동 재입장: ${this.roomJoined}`)
          this.emit('join_room', { roomId: this.roomJoined })
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
  joinRoom(roomId: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!roomId) {
        console.error('[Socket] 유효하지 않은 방 ID')
        resolve(false)
        return
      }
      
      // 방 ID 저장
      this.roomJoined = roomId
      
      // 소켓 연결 확인
      if (!this.isConnected || !this.socket) {
        console.error('[Socket] 소켓 연결 실패로 방 입장 불가')
        // 폴링으로 메시지를 가져오기 위해 true 반환
        resolve(true)
        return
      }
      
      try {
        // 소켓 이벤트 발생
        this.emit('join_room', { roomId })
        console.log(`[Socket] 방 입장 성공: ${roomId}`)
        resolve(true)
      } catch (err) {
        console.error('[Socket] 방 입장 중 오류:', err)
        resolve(false)
      }
    })
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
    // 소켓이 없으면 자동으로 연결 시도
    if (!this.socket) {
      console.log('[Socket] 소켓이 초기화되지 않아 연결을 시도합니다.')
      this.connect()
      
      // 소켓이 여전히 없으면 오류 발생
      if (!this.socket) {
        console.error('[Socket] 소켓 연결 실패. 이벤트를 전송할 수 없습니다.')
        return
      }
    }
    
    // 방 이벤트인 경우 방 ID 저장
    if (event === 'join_room' && data && data.roomId) {
      this.roomJoined = data.roomId
      console.log(`[Socket] 참여한 방 ID 저장: ${this.roomJoined}`)
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

  // 소켓 연결 상태 확인
  isSocketConnected() {
    return this.isConnected && this.socket !== null
}

// 소켓 이벤트 수신 리스너 등록
on(event: string, callback: (data: any) => void): () => void {
  console.log(`[Socket] 이벤트 리스너 등록: ${event}`)

  // 소켓이 없으면 자동으로 연결 시도
  if (!this.socket) {
    console.log('[Socket] 소켓이 초기화되지 않아 연결을 시도합니다.')
    this.connect()
  }

  // 이벤트 리스너 맵에 콜백 추가
  if (!this.eventListeners[event]) {
    this.eventListeners[event] = []
  }

  // 중복 등록 방지
  if (!this.eventListeners[event].includes(callback)) {
    this.eventListeners[event].push(callback)
  }

  // 소켓이 연결되었는지 확인
  if (this.isSocketConnected()) {
    // 기존 리스너가 이미 있는지 확인
    console.log(`[Socket] ${event} 이벤트 리스너 등록 시도`)
    
    // 해당 이벤트에 대한 기존 리스너 해제
    this.socket?.off(event)
    
    // 새로운 이벤트 리스너 등록
    this.socket?.on(event, (data: any) => {
      console.log(`[Socket] 이벤트 수신: ${event}`, typeof data === 'object' ? JSON.stringify(data).substring(0, 100) : data)
      
      // 각 콜백을 호출하여 이벤트 데이터 공유
      if (this.eventListeners[event]) {
        this.eventListeners[event].forEach(cb => {
          try {
            cb(data)
          } catch (error) {
            console.error(`[Socket] 이벤트 처리 중 오류: ${event}`, error)
          }
        })
      }
    })
    
    console.log(`[Socket] ${event} 이벤트 리스너 등록 완료`)
  } else {
    console.warn(`[Socket] 소켓이 연결되지 않아 리스너만 등록함. 연결 후 자동으로 리스너 등록 예정`)
  }

  // 리스너 해제 함수 반환
  return () => {
    console.log(`[Socket] 이벤트 리스너 제거: ${event}`)
    
    // 리스너 제거
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        (cb) => cb !== callback,
      )
    }
  }
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
