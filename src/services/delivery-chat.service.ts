import { io, Socket } from 'socket.io-client';
import { getRecoil } from 'recoil-nexus';
import { userAtom } from '@/atoms/userAtom';
import { SOCKET_URL } from '../config/api';

export interface ChatMessage {
  id: string;
  userId: string;
  deliveryRoomId: string;
  message: string;
  createdAt: string;
  user?: {
    id: number;
    name?: string;
    nickname?: string;
    profileImage?: string;
  };
  isFromCurrentUser?: boolean;
  senderName?: string; // 캐시에 저장할 발신자 이름
}

export interface ChatParticipant {
  id: string;
  userId: string;
  deliveryRoomId: string;
  orderDetails: string;
  amount: number;
  createdAt: string;
  user: {
    id: number;
    name?: string;
    nickname?: string;
    profileImage?: string;
  };
}

// 사용자 상태 타입 정의
interface UserState {
  id: number;
  email: string;
  nickname?: string;
  name?: string;
  phoneNumber?: string;
}

class DeliveryChatService {
  private socket: Socket | null = null;
  private isConnected = false;
  private currentRoomId: string | null = null;
  private messageListeners: Map<string, (message: ChatMessage) => void> = new Map();
  private participantListeners: Map<string, (participants: ChatParticipant[]) => void> = new Map();
  private messageCache: Record<string, ChatMessage[]> = {};

  constructor() {
    // 서버사이드 렌더링 환경에서는 초기화 생략
    if (typeof window !== 'undefined') {
      this.setupConnection();
    }
  }

  private setupConnection() {
    // 이미 소켓이 연결되어 있다면 추가 설정 생략
    if (this.isConnected && this.socket) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('[DeliveryChat] 인증 토큰이 없습니다');
      return;
    }

    // 사용자 ID 가져오기
    let userId;
    try {
      const userRecoilState = getRecoil(userAtom);
      userId = userRecoilState?.id;
    } catch (error) {
      console.warn('[DeliveryChat] Recoil에서 사용자 정보를 가져오는데 실패:', error);
    }

    // localStorage에서 사용자 정보 백업 가져오기
    if (!userId) {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          userId = userData?.id;
        }
      } catch (error) {
        console.error('[DeliveryChat] localStorage에서 사용자 정보 파싱 실패:', error);
      }
    }

    if (!userId) {
      console.error('[DeliveryChat] 사용자 ID를 찾을 수 없어 소켓 연결을 할 수 없습니다');
      return;
    }

    // Socket.IO 연결
    this.socket = io(`${SOCKET_URL}/delivery`, {
      auth: {
        token,
        userId,
      },
      transports: ['polling', 'websocket'],
      reconnection: true,
    });

    // 소켓 연결 이벤트 핸들러
    this.socket.on('connect', () => {
      console.log('[DeliveryChat] 소켓 연결 성공');
      this.isConnected = true;

      // 이전에 참여했던 채팅방이 있다면 재참여
      if (this.currentRoomId) {
        this.joinRoom(this.currentRoomId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('[DeliveryChat] 소켓 연결 종료');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('[DeliveryChat] 소켓 오류:', error);
    });

    // 새 메시지 수신 이벤트 핸들러 설정
    this.setupMessageHandler();
  }

  private setupMessageHandler() {
    if (!this.socket) return;

    // 새 메시지 이벤트 핸들러
    this.socket.on('newMessage', (message: ChatMessage) => {
      console.log('[DeliveryChat] 새 메시지 수신:', message);

      // 캐시에 메시지 추가
      if (!this.messageCache[message.deliveryRoomId]) {
        this.messageCache[message.deliveryRoomId] = [];
      }

      // 현재 사용자 ID 가져오기
      const currentUser = this.getCurrentUser();
      // currentUser와 currentUser.id가 존재하는지 확인하여 TypeError 방지
      const isFromCurrentUser = !!(currentUser && currentUser.id && message.userId === String(currentUser.id));

      // 발신자 이름 결정 (우선순위)
      let senderName: string | undefined;

      // 1. 자신이 보낸 메시지
      if (isFromCurrentUser) {
        senderName = '나';
        message.senderName = '나'; // UI용 표시 이름

        // 백엔드에 저장하기 위한 실제 발신자 정보 보존
        if (!message.user && currentUser) {
          message.user = {
            id: currentUser.id,
            nickname: currentUser.nickname || ''
          };
        }
      }
      // 2. 메시지에 senderNickname 필드가 있는 경우 (소켓 이벤트에서 추가로 받은 경우)
      else if ((message as any).senderNickname) {
        senderName = (message as any).senderNickname;
        message.senderName = senderName;
        
        // user 정보가 없다면 추가
        if (!message.user) {
          message.user = {
            id: Number((message as any).senderId) || 0,
            nickname: senderName
          };
        }
      }
      // 3. 다른 사용자가 보낸 메시지는 user 객체 사용
      else if (message.user) {
        senderName = message.user.nickname || message.user.name;
        // 발신자 이름 캐싱
        message.senderName = senderName;
      }
      // 4. 발신자 정보가 전혀 없는 경우 '익명'으로 표시
      else {
        console.log('[DeliveryChat] 발신자 정보가 없어 익명으로 표시');
        senderName = '익명';
        message.senderName = '익명';
      }

      // 중복 메시지 체크 강화
      const isDuplicate = this.messageCache[message.deliveryRoomId].some(msg =>
        // ID가 같은 경우
        msg.id === message.id ||
        // 내용, 사용자, 시간이 비슷한 경우 (반복적인 소켓 이벤트 처리)
        (
          msg.message === message.message &&
          msg.userId === message.userId &&
          Math.abs(new Date(msg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 2000
        )
      );

      if (!isDuplicate) {
        // 자신이 보낸 메시지인지 표시
        message.isFromCurrentUser = isFromCurrentUser;

        console.log('[DeliveryChat] 캐시에 추가된 메시지 정보:', {
          id: message.id,
          발신자ID: message.userId,
          발신자이름: message.senderName,
          user정보: message.user
        });

        // 캐시에 추가
        this.messageCache[message.deliveryRoomId].push(message);

        // 리스너에게 알림
        const listener = this.messageListeners.get(message.deliveryRoomId);
        if (listener) {
          listener(message);
        }
      } else {
        console.log('[DeliveryChat] 중복 메시지 제외:', message.message);
      }
    });
  }

  // 현재 사용자 정보 가져오기
  private getCurrentUser() {
    try {
      return getRecoil(userAtom);
    } catch (error) {
      console.warn('[DeliveryChat] 현재 사용자 정보를 가져오는데 실패:', error);
      return null;
    }
  }

  // 채팅방 참여
  async joinRoom(roomId: string): Promise<boolean> {
    if (!this.socket || !this.isConnected) {
      await this.setupConnection();
    }

    if (!this.socket || !this.isConnected) {
      console.error('[DeliveryChat] 소켓 연결이 없어 방에 참여할 수 없습니다');
      return false;
    }

    try {
      const user = this.getCurrentUser();
      if (!user) {
        console.error('[DeliveryChat] 사용자 정보가 없어 방에 참여할 수 없습니다');
        return false;
      }

      // 서버에 방 참여 요청
      return new Promise((resolve) => {
        if (!this.socket) {
          resolve(false);
          return;
        }

        this.socket.emit('joinRoom', {
          deliveryRoomId: roomId,
          orderDetails: '',
          amount: 0
        }, (response: any) => {
          if (response.success) {
            console.log(`[DeliveryChat] 방 ${roomId}에 참여 성공`);
            this.currentRoomId = roomId;
            resolve(true);
          } else {
            console.error(`[DeliveryChat] 방 참여 실패:`, response.message);
            resolve(false);
          }
        });
      });
    } catch (error) {
      console.error('[DeliveryChat] 방 참여 중 오류:', error);
      return false;
    }
  }

  // 채팅방 나가기
  async leaveRoom(roomId: string): Promise<boolean> {
    if (!roomId) {
      console.log('[DeliveryChat] 방 ID가 없어 나가기를 무시합니다');
      return true; // 방 ID가 없으면 이미 나간 것으로 간주하고 성공 처리
    }

    if (!this.socket || !this.isConnected) {
      console.log('[DeliveryChat] 소켓 연결이 없습니다. 로컬 처리만 수행합니다.');
      this.currentRoomId = null;
      return true; // 소켓 연결이 없어도 클라이언트 측에서는 성공으로 처리
    }

    try {
      return new Promise((resolve) => {
        // 제한 시간 설정 (5초)
        const timeout = setTimeout(() => {
          console.log(`[DeliveryChat] 방 나가기 시간 초과. 로컬 처리만 수행합니다.`);
          if (this.currentRoomId === roomId) {
            this.currentRoomId = null;
          }
          resolve(true);
        }, 5000);

        if (!this.socket) {
          clearTimeout(timeout);
          this.currentRoomId = null;
          resolve(true); // 로컬에서만 처리
          return;
        }

        this.socket.emit('leaveRoom', { roomId }, (response: any) => {
          clearTimeout(timeout);

          if (response && response.success) {
            console.log(`[DeliveryChat] 방 ${roomId}에서 나가기 성공`);
          } else {
            // 실패해도 클라이언트 측에서는 성공으로 처리
            console.log(`[DeliveryChat] 서버 응답 없음 또는 참여 정보를 찾을 수 없음. 로컬에서만 처리합니다.`);
          }

          if (this.currentRoomId === roomId) {
            this.currentRoomId = null;
          }
          resolve(true);
        });
      });
    } catch (error) {
      console.log('[DeliveryChat] 방 나가기 중 오류. 로컬 처리만 수행합니다:', error);
      this.currentRoomId = null;
      return true; // 오류가 발생해도 클라이언트 측에서는 성공으로 처리
    }
  }

  // 메시지 전송
  async sendMessage(roomId: string, content: string): Promise<ChatMessage | null> {
    if (!this.socket || !this.isConnected) {
      console.error('[DeliveryChat] 소켓 연결이 없어 메시지를 보낼 수 없습니다');
      return null;
    }

    try {
      const user = this.getCurrentUser();
      if (!user) {
        console.error('[DeliveryChat] 사용자 정보가 없어 메시지를 보낼 수 없습니다');
        return null;
      }

      // 서버에 메시지 전송 요청
      return new Promise((resolve) => {
        if (!this.socket) {
          resolve(null);
          return;
        }

        // 사용자 닉네임 정보를 함께 보내어 발신자가 "알 수 없음"으로 표시되는 문제 해결
        this.socket.emit('sendMessage', {
          roomId,
          message: content,
          senderNickname: user.nickname || '',
          senderId: user.id
        }, (response: any) => {
          if (response.success) {
            console.log(`[DeliveryChat] 메시지 전송 성공`);

            // 서버로부터 받은 메시지에 현재 사용자 플래그 추가
            const message = response.message;
            message.isFromCurrentUser = true;

            resolve(message);
          } else {
            console.error(`[DeliveryChat] 메시지 전송 실패:`, response.message);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('[DeliveryChat] 메시지 전송 중 오류:', error);
      return null;
    }
  }

  // 메시지 목록 가져오기
  async getMessages(roomId: string): Promise<ChatMessage[]> {
    this.checkConnection();

    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.emit('getMessages', { roomId }, (response: any) => {
          if (response.success) {
            const messages = response.messages || [];
            console.log('[DeliveryChat] 서버에서 가져온 메시지:', messages);

            // 캐시 업데이트
            if (!this.messageCache[roomId]) {
              this.messageCache[roomId] = [];
            }

            // 현재 사용자 정보
            const currentUser = this.getCurrentUser();
            const currentUserId = currentUser?.id;

            // 메시지 처리 및 캐시에 추가
            messages.forEach((message: ChatMessage) => {
              // 자신이 보낸 메시지인지 확인
              const isFromCurrentUser = currentUserId && message.userId === String(currentUserId);
              message.isFromCurrentUser = isFromCurrentUser;

              // 발신자 정보 보존 및 강화
              if (message.user) {
                // 백엔드에서 받은 user 객체에서 이름 정보 추출
                message.senderName = message.user.nickname || message.user.name;
              }

              // 자신의 메시지는 '나'로 표시 (UI용)
              if (isFromCurrentUser) {
                message.senderName = '나';
              }

              // 중복 메시지 체크
              const isDuplicate = this.messageCache[roomId].some(msg => msg.id === message.id);
              if (!isDuplicate) {
                this.messageCache[roomId].push(message);
              }
            });

            // 시간순 정렬 (오래된 메시지가 위로)
            this.messageCache[roomId].sort((a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );

            console.log('[DeliveryChat] 최종 메시지 캐시:', this.messageCache[roomId]);
            resolve(this.messageCache[roomId]);
          } else {
            reject(new Error(response.message || '메시지를 가져오는데 실패했습니다'));
          }
        });
      } else {
        reject(new Error('소켓 연결이 없습니다'));
      }
    });
  }

  // 참여자 목록 가져오기
  async getParticipants(roomId: string): Promise<ChatParticipant[]> {
    this.checkConnection();

    if (!this.socket) {
      return Promise.reject(new Error('소켓이 연결되어 있지 않습니다.'));
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('getRoomDetails', { roomId }, (response: any) => {
        if (response.success && response.room && response.room.participants) {
          const participants = response.room.participants;

          // 참여자 정보 로깅 (디버깅용)
          participants.forEach((p: ChatParticipant) => {
            if (p.user) {
              console.log(`[DeliveryChat] 참여자 ${p.id}: 이름=${p.user.nickname || p.user.name}, 유저ID=${p.userId}`);
            }
          });

          console.log('[DeliveryChat] 참여자 목록 가져옴:', participants);
          resolve(participants);
        } else {
          console.error('[DeliveryChat] 참여자 목록 실패:', response);
          reject(new Error(response.message || '참여자 목록을 가져오는데 실패했습니다'));
        }
      });
    });
  }

  // 새 메시지 리스너 등록
  onNewMessage(roomId: string, callback: (message: ChatMessage) => void): () => void {
    if (!roomId) {
      console.error('[DeliveryChat] 방 ID가 없어 리스너를 등록할 수 없습니다');
      return () => { };
    }

    // 기존 리스너 삭제
    this.messageListeners.delete(roomId);

    // 새 리스너 등록
    this.messageListeners.set(roomId, callback);

    // 해제 함수 반환
    return () => {
      this.messageListeners.delete(roomId);
    };
  }

  // 참여자 목록 변경 리스너 등록
  onParticipantsUpdated(roomId: string, callback: (participants: ChatParticipant[]) => void): () => void {
    if (!roomId) {
      console.error('[DeliveryChat] 방 ID가 없어 참여자 리스너를 등록할 수 없습니다');
      return () => {};
    }

    // 기존 리스너 삭제
    this.participantListeners.delete(roomId);

    // 새 리스너 등록
    this.participantListeners.set(roomId, callback);

    // 참여자 목록 업데이트 이벤트 핸들러 (소켓에 직접 등록)
    if (this.socket) {
      this.socket.on('participantsUpdated', (participants: ChatParticipant[]) => {
        console.log('[DeliveryChat] 참여자 목록 업데이트:', participants);
        
        if (!participants || !Array.isArray(participants) || participants.length === 0) {
          console.warn('[DeliveryChat] 참여자 목록이 비어있거나 유효하지 않음');
          return;
        }
        
        // 현재 채팅방에 대한 리스너에게만 알림
        const deliveryRoomId = participants[0].deliveryRoomId;
        if (deliveryRoomId === roomId) {
          const listener = this.participantListeners.get(deliveryRoomId);
          
          if (listener) {
            listener(participants);
          }
        }
      });
    }

    // 해제 함수 반환
    return () => {
      this.participantListeners.delete(roomId);
      // 소켓 리스너는 연결 해제시 함께 정리됨
    };
  }

  // 소켓 연결 상태 확인
  private checkConnection() {
    if (!this.socket || !this.isConnected) {
      this.setupConnection();
    }
  }
}

// 싱글턴 인스턴스
const deliveryChatService = new DeliveryChatService();
export default deliveryChatService;
