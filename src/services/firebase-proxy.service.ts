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
  private activePollingIntervals: Record<string, boolean> = {}; // 활성화된 폴링 인터벌 관리
  private lastMessages: Record<string, FirebaseMessage[]> = {}; // 최근 메시지 캐싱

  constructor() {
    // Socket.io 이벤트 리스너 설정
    this.setupSocketListeners();
  }

  // Socket.io 이벤트 리스너 초기화
  private setupSocketListeners() {
    // 새 메시지 수신 이벤트
    socketService.on('new_message', (data: { roomId: string; message: FirebaseMessage }) => {
      console.log(`[FirebaseProxy] 새 메시지 수신 - 방 ID: ${data.roomId}`, data.message);
      
      // 현재 사용자가 보낸 메시지인지 확인
      const user = this.getCurrentUser();
      const isFromCurrentUser = data.message.senderId === user.id;
      
      // 메시지 데이터 상세 로깅
      console.log(`[FirebaseProxy] 메시지 정보:`, {
        id: data.message.id,
        content: data.message.content,
        senderName: data.message.senderName,
        isFromCurrentUser: isFromCurrentUser
      });
      
      const listener = this.messageListeners.get(data.roomId);
      if (listener) {
        // 리스너에 메시지 전달 (필요한 필드 보장)
        listener({
          ...data.message,
          isFromCurrentUser,
          deliveryRoomId: data.roomId // 누락된 경우 대비
        });
      } else {
        console.warn(`[FirebaseProxy] 방 ${data.roomId}의 메시지 리스너가 없습니다. 메시지가 수신되었지만 표시되지 않습니다.`);
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
  getCurrentUser() {
    const userRecoilState = getRecoil(userAtom);
    if (userRecoilState && userRecoilState.id) {
      return {
        id: String(userRecoilState.id),
        name: userRecoilState.nickname || '익명',
        avatar: userRecoilState.profileImage,
      };
    }
    
    // 로그인하지 않은 경우 임시 사용자 정보
    return {
      id: '0',
      name: '익명',
      avatar: '',
    };
  }
  
  // 인증 토큰 가져오기
  private getAuthToken() {
    const userRecoilState = getRecoil(userAtom);
    return userRecoilState?.token || localStorage.getItem('jwt_token') || '';
  }
  
  // 인증된 HTTP 요청 헤더 가져오기
  private getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  // 방 참여하기 (Socket.io 사용)
  async joinRoom(roomId: string): Promise<boolean> {
    try {
      // 중복 참여 방지
      if (this.roomJoined === roomId) {
        console.log(`[이미 참여 중] 방 ${roomId}에 이미 참여하고 있습니다.`);
        
        // 방 자동 참여를 위해 소켓 방에 입장
        socketService.joinRoom(roomId);
      }

      const user = this.getCurrentUser();
      const token = this.getAuthToken();
      
      // 소켓 이벤트로 방 참여 알림 (토큰 포함)
      socketService.emit('join_room', { 
        roomId, 
        userData: user,
        token
      });
      
      // 또는 API를 통해 방 참여 등록 (인증 헤더 포함)
      const response = await axios.post(
        `${API_BASE_URL}/api/firebase/rooms/${roomId}/join`, 
        user, 
        this.getAuthHeaders()
      );
      
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
      const token = this.getAuthToken();
      
      // 소켓 이벤트로 방 나가기 알림 (토큰 포함)
      socketService.emit('leave_room', { 
        roomId, 
        userId: user.id,
        token
      });
      
      // 또는 API를 통해 방 나가기 등록 (인증 헤더 포함)
      const response = await axios.post(
        `${API_BASE_URL}/api/firebase/rooms/${roomId}/leave`, 
        { userId: user.id },
        this.getAuthHeaders()
      );
      
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
      const token = this.getAuthToken();
      
      const messageData = {
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        content,
        timestamp: new Date().toISOString(),
      };
      
      // 소켓 이벤트로 메시지 전송 알림 (토큰 포함)
      socketService.emit('send_message', { 
        roomId, 
        message: messageData,
        token
      });
      
      // 또는 API를 통해 메시지 저장 (인증 헤더 포함)
      const response = await axios.post(
        `${API_BASE_URL}/api/firebase/rooms/${roomId}/messages`, 
        messageData,
        this.getAuthHeaders()
      );
      
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
      
      // API를 통해 메시지 목록 조회 (인증 헤더 포함)
      const response = await axios.get(
        `${API_BASE_URL}/api/firebase/rooms/${roomId}/messages?limit=${messageLimit}`,
        this.getAuthHeaders()
      );
      
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
    
    // 방 ID 유효성 검사
    if (!roomId) {
      console.error('[FirebaseProxy] 유효하지 않은 방 ID로 메시지 리스너를 등록할 수 없습니다.');
      return () => {}; // 빈 해제 함수 반환
    }
    
    // 리스너 등록
    this.messageListeners.set(roomId, callback);
    
    // 이미 캐싱된 메시지가 있는지 확인하고 있으면 먼저 적용
    if (this.lastMessages[roomId] && this.lastMessages[roomId].length > 0) {
      console.log(`[FirebaseProxy] 캐싱된 메시지 ${this.lastMessages[roomId].length}개를 적용합니다.`);
      
      const user = this.getCurrentUser();
      const cachedMessages = this.lastMessages[roomId];
      
      // 캐싱된 데이터 전달
      cachedMessages.forEach(msg => {
        const isFromCurrentUser = msg.senderId === user.id;
        
        callback({
          ...msg,
          isFromCurrentUser
        });
      });
      
      // 캐싱된 메시지 재사용 완료 표시 (선택적)
      // this.lastMessages[roomId] = [];
    }
    
    // 초기 메시지 로딩 - 가져온 메시지를 즉시 처리
    this.getMessages(roomId, 30).then(messages => {
      if (messages && messages.length > 0) {
        // 최소한의 로그만 출력 - 개수만 표시
        console.log(`[FirebaseProxy] 초기 메시지 ${messages.length}개 로드 완료`);  
        
        // 메시지 전달을 위한 사용자 정보 가져오기
        const user = this.getCurrentUser();
        
        // 모든 메시지를 한 번에 전달 (로그 없이)
        messages.forEach(msg => {
          // 현재 사용자가 보낸 메시지인지 확인
          const isFromCurrentUser = msg.senderId === user.id;
          
          // 콜백을 통해 메시지 전달 (로그 없이)
          callback({
            ...msg,
            isFromCurrentUser
          });
        });
      }
    }).catch(err => {
      // 오류만 출력
      console.error(`[FirebaseProxy] 메시지 가져오기 오류:`, err);
    });
    
    // Socket.io 연결 확인 (서버 사이드 렌더링 환경에서는 스킵)
    if (typeof window !== 'undefined') {
      // 1. 소켓 연결 확인 및 연결 시도
      if (!socketService.isSocketConnected()) {
        console.log('[FirebaseProxy] 소켓 연결이 안 되어 있어 연결 시도...');
        socketService.connect();
      }
      
      // 2. 방 참여 확인 및 자동 참여
      if (roomId !== this.roomJoined) {
        console.log(`[FirebaseProxy] 방 ${roomId}에 자동 참여`);
        this.joinRoom(roomId).catch(err => {
          console.warn(`[FirebaseProxy] 방 ${roomId} 자동 참여 실패:`, err);
        });
      }
      
      // 3. 'new_message' 소켓 이벤트를 직접 들음
      socketService.on('new_message', (data: { roomId: string; message: FirebaseMessage }) => {
        console.log('[FirebaseProxy] 소켓을 통해 새 메시지 수신:', data);
        
        // 방 ID가 다르면 무시
        if (data.roomId !== roomId) {
          console.log(`[FirebaseProxy] 다른 방 메시지 무시 (${data.roomId} != ${roomId})`);
          return;
        }
        
        // 현재 사용자가 보낸 메시지인지 확인
        const user = this.getCurrentUser();
        const isFromCurrentUser = data.message.senderId === user.id;
        
        // 상세 정보 로깅
        console.log(`[FirebaseProxy] 소켓 메시지 상세 정보:`, {
          id: data.message.id,
          content: data.message.content,
          senderId: data.message.senderId,
          roomId: data.roomId,
          isCurrentUser: isFromCurrentUser
        });
        
        // 해당 방에 등록된 리스너가 있는지 확인
        const listener = this.messageListeners.get(data.roomId);
        if (listener) {
          // 사용자 정보 추가하여 리스너에 전달
          listener({
            ...data.message,
            isFromCurrentUser
          });
        }
      });
      
      // 폴링 설정 - 소켓이 먼저 시도되고, 실패하면 폴링으로 대체
      let isPollingActive = true; // 폴링 상태 플래그
      let pollCount = 0; // 폴링 횟수 카운터
      let lastMessageId = ''; // 가장 최근 수신한 메시지 ID
      
      // 현재 방에 사용되는 폴링 인터벌 저장
      this.activePollingIntervals[roomId] = true;
      
      // 4. API를 통한 폴링 - 더 긴 간격으로 실행 (5초)
      const pollInterval = setInterval(() => {
        // 폴링 횟수 증가
        pollCount++;
        
        // 방이 정리되거나 활성화되지 않음
        if (!this.activePollingIntervals[roomId]) {
          console.log(`[FirebaseProxy] 방 ${roomId} 메시지 폴링 중지 - 방 사용 종료`);
          clearInterval(pollInterval);
          return;
        }
        
        // 리스너가 없는 경우 - 5회마다 로그 출력
        if (!this.messageListeners.has(roomId)) {
          // 폴링 중에 리스너가 없는 경우 - 5회마다만 로그 출력
          if (isPollingActive && pollCount % 5 === 0) {
            console.log(`[FirebaseProxy] 방 ${roomId} 메시지 리스너 없음 (${pollCount}회차 폴링)`);  
            isPollingActive = false;
          }
          
          // 리스너가 없을 때는 더 긴 간격으로 폴링 - 여기서 리턴하지 않고 계속 실행
        } else {
          // 리스너가 다시 생겼으면 플래그 활성화
          isPollingActive = true;
        }
        
        // 최신 메시지 10개만 가져오기
        this.getMessages(roomId, 10)
          .then(recentMessages => {
            if (recentMessages && recentMessages.length > 0) {
              // 이미 같은 메시지를 처리한 경우 로그만 최소화
              const latestMessageId = recentMessages[recentMessages.length - 1].id;
              
              // 같은 메시지인 경우 로그 줄이고 아무것도 하지 않음
              if (latestMessageId === lastMessageId && pollCount % 10 !== 0) {
                return; // 동일한 메시지이고 10회마다 갱신이 아니면 아무것도 하지 않음
              }
              
              // 새로운 메시지가 있거나 10회마다 갱신하는 경우 로그 출력
              if (latestMessageId !== lastMessageId || pollCount % 10 === 0) {
                // 최신 메시지 ID 업데이트
                lastMessageId = latestMessageId;
                console.log(`[FirebaseProxy] 폴링(${pollCount}회차): 최신 메시지 ${recentMessages.length}개`);  
              }
              
              // 반환된 메시지들을 리스너에 전달
              const user = this.getCurrentUser();
              
              // 최신 메시지를 리스너에 전달할 수 있을 때만 처리
              if (this.messageListeners.has(roomId)) {
                // 그러나 메시지가 동일하지 않을 때만 새로운 메시지를 전달
                if (latestMessageId !== lastMessageId || pollCount === 1) { 
                  const listener = this.messageListeners.get(roomId);
                  if (listener) {
                    recentMessages.forEach(msg => {
                      // 현재 사용자가 보낸 메시지인지 확인
                      const isFromCurrentUser = msg.senderId === user.id;
                      
                      // 상세 정보 로깅 - 성능을 위해 최소화 (10회마다 반복)
                      if (pollCount % 10 === 0) {
                        console.log(`[FirebaseProxy] 폴링 메시지 ID: ${msg.id}`);
                      }
                      
                      // 실제 메시지 전달 - 폴링 또는 최초 호출시에만 전달
                      listener({
                        ...msg,
                        isFromCurrentUser
                      });
                    });
                  }
                }
              } else {
                // 중요: 리스너가 없어도 최신 메시지 정보는 저장
                this.lastMessages[roomId] = recentMessages;
                
                // 로그 출력 줄이기 - 5회마다만 출력
                if (pollCount % 5 === 0) {
                  console.log(`[FirebaseProxy] 리스너 없음, 메시지 ${recentMessages.length}개 캐싱(폴링 ${pollCount}회차)`);
                }
              }
            }
          })
          .catch(err => console.error(`[FirebaseProxy] 방 ${roomId} 메시지 폴링 오류:`, err));
      }, 5000); // 5초마다 폴링(더 긴 간격으로 변경)
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
