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

  // 소켓 연결 메소드
  connect(): Socket | null {
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

      // 소켓 연결 시도
      console.log(`[Socket] 연결 시도 - URL: ${SOCKET_URL}, 사용자 ID: ${userId}`)
      
      try {
        this.socket = io(SOCKET_URL, {
          auth: {
            token: token,
            userId: userId,
          },
          transports: ['polling', 'websocket'], // polling을 먼저 시도하고 websocket으로 업그레이드
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
          timeout: 30000, // 30초 타임아웃
          forceNew: true, // 새로운 연결 생성 강제
          path: '/socket.io', // 기본 경로 명시적 지정
        })
        
        console.log('[Socket] 소켓 객체 생성 성공')
      } catch (err) {
        console.error('[Socket] 소켓 객체 생성 중 오류:', err)
        this.isConnected = false
        return null
      }

      // 연결 이벤트 핸들러
      this.socket.on('connect', () => {
        console.log(
          '[Socket] 서버에 연결되었습니다. 연결 ID:',
          this.socket?.id
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

      // 연결 해제 이벤트 핸들러
      this.socket.on('disconnect', (reason) => {
        console.log(`[Socket] 서버 연결이 끊어졌습니다. 이유: ${reason}`)
        this.isConnected = false

        if (reason === 'io server disconnect' || reason === 'transport close') {
          // 서버에서 강제로 연결을 끊은 경우 또는 네트워크 문제로 자동 재연결 시도
          this.attemptReconnect()
        }
      })

      // 연결 오류 이벤트 핸들러
      this.socket.on('connect_error', (error) => {
        console.error('[Socket] 연결 오류 발생:', error.message)
        this.handleSocketError(error, '연결')
      })

      // 소켓 오류 이벤트 핸들러
      this.socket.on('error', (error) => {
        console.error('[Socket] 일반 오류 발생:', error)
        this.handleSocketError(error, '일반')
      })

      // 재연결 이벤트 핸들러
      this.socket.on('reconnect', (attemptNumber) => {
        console.log(`[Socket] 재연결 성공! 시도 횟수: ${attemptNumber}`)
        this.isConnected = true
        this.reconnectAttempts = 0
      })

      return this.socket
    } catch (error) {
      console.error('[Socket] 연결 중 예외 발생:', error)
      this.isConnected = false
      return null
    }
  }

  // 소켓 연결 해제 메소드
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.isConnected = false
    this.roomJoined = null
    console.log('[Socket] 연결이 해제되었습니다.')
  }

  // 이벤트 전송 메소드
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
  isSocketConnected(): boolean {
    return this.isConnected && this.socket !== null
  }

  // 이벤트 리스너 등록
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

  // 이벤트 리스너 제거
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

  // 소켓 객체 반환
  getSocket() {
    return this.socket
  }

  // 서버 연결 상태 확인
  isConnectedToServer() {
    return this.isConnected && this.socket !== null && this.socket.connected
  }

  // 현재 참여 중인 방 ID 반환
  getCurrentRoom() {
    return this.roomJoined
  }

  // 방 입장 메소드 - 개선된 버전
  joinRoom(roomId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!roomId) {
        console.error('[Socket] 유효하지 않은 방 ID')
        reject(new Error('유효하지 않은 방 ID'))
        return
      }
      
      // 소켓이 연결되지 않은 경우 자동 연결 시도
      if (!this.isSocketConnected()) {
        console.log('[Socket] 방 입장 전 자동 연결 시도')
        this.connect()
        
        // 연결 시도 후 재확인
        if (!this.isSocketConnected()) {
          console.error('[Socket] 소켓 연결을 할 수 없어 방 입장 불가')
          
          // 소켓 연결이 없어도 방에 입장했다고 표시
          this.roomJoined = roomId
          console.log(`[Socket] 소켓 연결 없이 방 입장 처리: ${roomId}`)
          resolve(true) // 폴링으로 메시지를 갱신할 수 있으므로 true 반환
          return
        }
      }
      
      try {
        console.log(`[Socket] 방 입장 시도: ${roomId}`)
        this.emit('join_room', { roomId })
        this.roomJoined = roomId
        console.log(`[Socket] 방 입장 성공: ${roomId}`)
        resolve(true)
      } catch (error) {
        console.error('[Socket] 방 입장 중 오류 발생:', error)
        // 오류가 발생해도 방 ID는 저장 (폴링에서 사용하기 위해)
        this.roomJoined = roomId
        resolve(true) // 오류가 발생해도 폴링으로 메시지 가져오기가 가능하므로 true 반환
      }
    })
  }

  // 이벤트 리스너 복구
  private restoreEventListeners() {
    // 각 이벤트 타입에 대해 등록된 리스너 복구
    Object.entries(this.eventListeners).forEach(([event, callbacks]) => {
      if (callbacks.length > 0 && this.socket) {
        console.log(`[Socket] 이벤트 리스너 복구: ${event}, 콜백 ${callbacks.length}개`)
        
        // 이전 리스너 제거 후 새로 등록
        this.socket.off(event)
        
        // 이벤트 리스너 등록
        this.socket.on(event, (data: any) => {
          console.log(`[Socket] 복구된 리스너로 이벤트 수신: ${event}`)
          // 등록된 모든 콜백에 데이터 전달
          callbacks.forEach(callback => {
            try {
              callback(data)
            } catch (error) {
              console.error(`[Socket] 복구된 리스너에서 오류: ${event}`, error)
            }
          })
        })
      }
    })
  }
  
  // 소켓 오류 처리 메소드
  private handleSocketError(error: any, operation: string) {
    console.error(`[Socket] ${operation} 중 오류:`, error)
    
    // 연결 상태 갱신
    if (this.socket) {
      this.isConnected = this.socket.connected
    } else {
      this.isConnected = false
    }
    
    // 재연결 시도 트리거
    if (!this.isConnected && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.attemptReconnect()
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
      `[Socket] 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`
    )

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect() // 재연결 시도
    }, this.reconnectInterval)
  }
}

// 싱글턴 인스턴스 생성
const socketService = new SocketService()
export default socketService
