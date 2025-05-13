import { io, Socket } from 'socket.io-client';
import { userAtom } from '../atoms/userAtom';
import { API_BASE_URL, SOCKET_URL } from '../config/api';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(user: any) {
    if (this.isConnected) return;

    try {
      if (!user || !user.token) {
        console.error('[Socket] 사용자 정보가 없어 소켓 연결을 할 수 없습니다.');
        return;
      }

      this.socket = io(`${SOCKET_URL}/delivery`, {
        auth: {
          token: user.token,
          userId: user.id,
        },
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('[Socket] 서버에 연결되었습니다.');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('[Socket] 서버 연결이 끊어졌습니다.');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('[Socket] 연결 오류:', error);
        this.isConnected = false;
      });

      return this.socket;
    } catch (error) {
      console.error('[Socket] 소켓 초기화 중 오류:', error);
      return null;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
      this.socket = null;
    }
  }

  emit(event: string, data: any, callback?: (response: any) => void) {
    if (!this.socket) {
      console.error('[Socket] 소켓이 초기화되지 않았습니다.');
      return;
    }

    if (callback) {
      this.socket.emit(event, data, callback);
    } else {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      console.error('[Socket] 소켓이 초기화되지 않았습니다.');
      return;
    }

    this.socket.on(event, callback);
  }

  off(event: string) {
    if (!this.socket) {
      console.error('[Socket] 소켓이 초기화되지 않았습니다.');
      return;
    }

    this.socket.off(event);
  }

  getSocket() {
    return this.socket;
  }

  isConnectedToServer() {
    return this.isConnected;
  }
}

// 싱글턴 인스턴스 생성
const socketService = new SocketService();
export default socketService;
