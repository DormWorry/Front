import { getRecoil } from 'recoil-nexus';
import { userAtom } from '@/atoms/userAtom';
import socketService from './socket.service';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// 메시지 타입
export interface FirebaseMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: any;
  deliveryRoomId: string;
  isFromCurrentUser?: boolean; // 현재 사용자가 보낸 메시지인지 식별
}

// 참여자 타입
export interface FirebaseParticipant {
  id: string;
  name: string;
  avatar?: string;
  lastActive: any;
  isActive: boolean;
}

class FirebaseProxyService {
  private messageListeners: Map<string, (message: FirebaseMessage) => void> = new Map();
  private participantListeners: Map<string, (participants: FirebaseParticipant[]) => void> = new Map();
  private roomJoined: string | null = null;

  constructor() {
    // Socket.io 이벤트 리스너 설정
    this.setupSocketListeners();
  }

  // Socket.io 이벤트 리스너 초기화
  private setupSocketListeners() {
    // 새 메시지 수신 이벤트
    socketService.on('new_message', (data: { roomId: string; message: FirebaseMessage }) => {
      console.log(`[FirebaseProxy] 새 메시지 수신 - 방 ID: ${data.roomId}`, data.message);
      
      const listener = this.messageListeners.get(data.roomId);
      if (listener) {
        // 현재 사용자가 보낸 메시지인지 확인
        const user = this.getCurrentUser();
        const isFromCurrentUser = data.message.senderId === user.id;
        
        // 리스너에 메시지 전달
        listener({
          ...data.message,
          isFromCurrentUser
        });
      }
    });

    // 사용자 참여 이벤트
    socketService.on('user_joined', (data: { roomId: string; user: any }) => {
      console.log(`[FirebaseProxy] 사용자 참여 - 방 ID: ${data.roomId}`, data.user);
      // 참여자 목록 업데이트 요청
      this.requestParticipantListUpdate(data.roomId);
    });

    // 사용자 나가기 이벤트
    socketService.on('user_left', (data: { roomId: string; userId: string }) => {
      console.log(`[FirebaseProxy] 사용자 나감 - 방 ID: ${data.roomId}`, data.userId);
      // 참여자 목록 업데이트 요청
      this.requestParticipantListUpdate(data.roomId);
    });

    // 참여자 목록 업데이트 이벤트
    socketService.on('active_users_updated', (data: { roomId: string; participants: FirebaseParticipant[] }) => {
      console.log(`[FirebaseProxy] 참여자 목록 업데이트 - 방 ID: ${data.roomId}`, data.participants.length);
      
      const listener = this.participantListeners.get(data.roomId);
      if (listener) {
        listener(data.participants);
      }
    });
  }

  // 참여자 목록 업데이트 요청
  private requestParticipantListUpdate(roomId: string) {
    socketService.emit('get_active_users', { roomId });
  }

  // 현재 사용자 정보 가져오기
  private getCurrentUser() {
    // 1. Recoil에서 사용자 정보 가져오기
    try {
      const userRecoilState = getRecoil(userAtom);
      if (userRecoilState && userRecoilState.id) {
        return {
          id: String(userRecoilState.id),
          name: userRecoilState.nickname || '익명',
          avatar: userRecoilState.profileImage,
        };
      }
    } catch (recoilError) {
      console.warn('[FirebaseProxy] Recoil에서 사용자 정보를 가져오는데 실패:', recoilError);
    }
    
    // 2. localStorage에서 가져오기 (백업 방법)
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        return {
          id: String(userData.id),
          name: userData.nickname || '익명',
          avatar: userData.profileImage,
        };
      }
    } catch (parseError) {
      console.error('[FirebaseProxy] localStorage에서 사용자 정보 파싱 실패:', parseError);
    }
    
    // 기본값 반환
    return {
      id: '0',
      name: '익명',
      avatar: undefined,
    };
  }

  // 방 참여하기 (Socket.io 사용)
  async joinRoom(roomId: string) {
    try {
      if (!roomId) {
        console.error('[FirebaseProxy] 유효하지 않은 방 ID');
        return false;
      }

      this.roomJoined = roomId;
      
      // 소켓 연결 확인
      if (!socketService.isSocketConnected()) {
        console.log('[FirebaseProxy] 소켓 연결이 안 되어 있어 연결 시도...');
        socketService.connect();
        
        // 방 자동 참여를 위해 소켓 방에 입장
        socketService.joinRoom(roomId);
      }

      const user = this.getCurrentUser();
      
      // 소켓 이벤트로 방 참여 알림
      socketService.emit('join_room', { 
        roomId, 
        userData: user 
      });
      
      // 또는 API를 통해 방 참여 등록
      const response = await axios.post(`${API_BASE_URL}/api/firebase/rooms/${roomId}/join`, user);
      
      console.log(`[FirebaseProxy] 방 ${roomId}에 참여자 등록 완료:`, user.name);
      return response.data.success;
    } catch (error) {
      console.error('[FirebaseProxy] 방 참여 중 오류:', error);
      return false;
    }
  }

  // 방 나가기 (Socket.io 사용)
  async leaveRoom(roomId: string) {
    try {
      const user = this.getCurrentUser();
      
      // 소켓 이벤트로 방 나가기 알림
      socketService.emit('leave_room', { 
        roomId, 
        userId: user.id 
      });
      
      // 또는 API를 통해 방 나가기 등록
      const response = await axios.post(`${API_BASE_URL}/api/firebase/rooms/${roomId}/leave`, {
        userId: user.id
      });
      
      // 리스너 정리
      this.messageListeners.delete(roomId);
      this.participantListeners.delete(roomId);
      this.roomJoined = null;
      
      console.log(`[FirebaseProxy] 방 ${roomId}에서 나가기 완료`);
      return response.data.success;
    } catch (error) {
      console.error('[FirebaseProxy] 방 나가기 중 오류:', error);
      return false;
    }
  }

  // 메시지 전송 (Socket.io 사용)
  async sendMessage(roomId: string, content: string) {
    try {
      const user = this.getCurrentUser();
      
      const messageData = {
        senderId: user.id || '0',
        senderName: user.name || '익명',
        senderAvatar: user.avatar || '',
        content: content || '',
        deliveryRoomId: roomId,
      };
      
      // 소켓 이벤트로 메시지 전송
      socketService.emit('send_message', { 
        roomId, 
        message: messageData 
      });
      
      // 또는 API를 통해 메시지 전송
      const response = await axios.post(`${API_BASE_URL}/api/firebase/rooms/${roomId}/messages`, messageData);
      
      console.log(`[FirebaseProxy] 메시지 전송 완료:`, content);
      return response.data;
    } catch (error) {
      console.error('[FirebaseProxy] 메시지 전송 중 오류:', error);
      throw error;
    }
  }

  // 메시지 가져오기 (REST API 사용)
  async getMessages(roomId: string, messageLimit: number = 30) {
    try {
      console.log(`[FirebaseProxy] 방 ${roomId}의 메시지 ${messageLimit}개 가져오기 시작`);
      
      // API를 통해 메시지 목록 조회
      const response = await axios.get(`${API_BASE_URL}/api/firebase/rooms/${roomId}/messages?limit=${messageLimit}`);
      
      if (!response.data || response.data.length === 0) {
        console.log(`[FirebaseProxy] 방 ${roomId}에 메시지가 없습니다`);
        return [];
      }
      
      // 현재 사용자 ID
      const currentUser = this.getCurrentUser();
      
      // 각 메시지에 현재 사용자 여부 표시
      const messages: FirebaseMessage[] = response.data.map((msg: any) => ({
        ...msg,
        isFromCurrentUser: msg.senderId === currentUser.id,
      }));
      
      console.log(`[FirebaseProxy] ${messages.length}개의 메시지를 가져왔습니다`);
      return messages;
    } catch (error) {
      console.error('[FirebaseProxy] 메시지 가져오기 중 오류:', error);
      return [];
    }
  }

  // 메시지 수신 리스너 설정
  onNewMessages(roomId: string, callback: (message: FirebaseMessage) => void) {
    console.log(`[FirebaseProxy] 방 ${roomId} 메시지 리스너 등록`);
    
    // 리스너 등록
    this.messageListeners.set(roomId, callback);
    
    // Socket.io 연결 확인
    if (!socketService.isSocketConnected()) {
      console.log('[FirebaseProxy] 소켓 연결이 안 되어 있어 연결 시도...');
      socketService.connect();
    }
    
    // 이미 방에 참여했는지 확인하고, 참여하지 않았으면 자동으로 참여
    if (roomId !== this.roomJoined) {
      console.log(`[FirebaseProxy] 방 ${roomId}에 자동 참여`);
      this.joinRoom(roomId);
    }
    
    // 리스너 해제 함수 반환
    return () => {
      console.log(`[FirebaseProxy] 방 ${roomId} 메시지 리스너 제거`);
      this.messageListeners.delete(roomId);
    };
  }

  // 참여자 리스너 설정
  onParticipantsUpdated(roomId: string, callback: (participants: FirebaseParticipant[]) => void) {
    console.log(`[FirebaseProxy] 방 ${roomId} 참여자 리스너 등록`);
    
    // 리스너 등록
    this.participantListeners.set(roomId, callback);
    
    // Socket.io 연결 확인
    if (!socketService.isSocketConnected()) {
      console.log('[FirebaseProxy] 소켓 연결이 안 되어 있어 연결 시도...');
      socketService.connect();
    }
    
    // 초기 참여자 목록 요청
    this.requestParticipantListUpdate(roomId);
    
    // 리스너 해제 함수 반환
    return () => {
      console.log(`[FirebaseProxy] 방 ${roomId} 참여자 리스너 제거`);
      this.participantListeners.delete(roomId);
    };
  }
}

// 싱글턴 인스턴스
const firebaseProxyService = new FirebaseProxyService();
export default firebaseProxyService;
