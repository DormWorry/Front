// Firebase 서비스가 firebase-proxy.service.ts로 대체되었습니다.
// 이 파일은 기존 코드와의 호환성을 위해 유지됩니다.
import firebaseProxyService, { FirebaseMessage, FirebaseParticipant } from './firebase-proxy.service';

// 타입 내보내기 (기존 코드와의 호환성 유지)
export type { FirebaseMessage, FirebaseParticipant };

// firebase-proxy.service.ts로 대체된 클래스
class FirebaseService {
  // 프록시 서비스를 통해 사용자 정보 가져오기
  private getCurrentUser() {
    // 구현은 firebase-proxy.service.ts로 이동됨
    return {};
  }
  
  // 방 초기화 (NestJS 백엔드 사용)
  async setupFirestoreRooms() {
    // 백엔드에서 자동으로 처리함
    return true;
  }
  
  // 방 참여하기 (프록시 서비스 사용)
  async joinRoom(roomId: string) {
    return firebaseProxyService.joinRoom(roomId);
  }
  
  // 방 나가기 (프록시 서비스 사용)
  async leaveRoom(roomId: string) {
    return firebaseProxyService.leaveRoom(roomId);
  }
  
  // 메시지 전송 (프록시 서비스 사용)
  async sendMessage(roomId: string, content: string) {
    return firebaseProxyService.sendMessage(roomId, content);
  }
  
  // 채팅방 메시지 가져오기 (프록시 서비스 사용)
  async getMessages(roomId: string, messageLimit: number = 30) {
    return firebaseProxyService.getMessages(roomId, messageLimit);
  }
  
  // 채팅방 메시지 실시간 수신 (프록시 서비스 사용)
  listenMessages(roomId: string, onMessageReceived: (message: FirebaseMessage) => void) {
    // 프록시 서비스의 onNewMessages로 대체됨
    return () => {};
  }
  
  // 메시지 리스너 설정 (프록시 서비스 사용)
  onNewMessages(roomId: string, callback: (messages: FirebaseMessage[]) => void) {
    return firebaseProxyService.onNewMessages(roomId, (message) => {
      // 단일 메시지를 배열로 래핑하여 기존 API와 호환성 유지
      callback([message]);
    });
  }
  
  // 참여자 리스너 설정 (프록시 서비스 사용)
  onParticipantsUpdated(roomId: string, callback: (participants: FirebaseParticipant[]) => void) {
    return firebaseProxyService.onParticipantsUpdated(roomId, callback);
  }
  
  // 채팅방 참여자 리스너 추가 (프록시 서비스 사용)
  listenParticipants(roomId: string, onParticipantsChange: (participants: FirebaseParticipant[]) => void) {
    // 프록시 서비스의 onParticipantsUpdated로 대체됨
    return () => {};
  }
}

// 싱글턴 인스턴스
const firebaseService = new FirebaseService();
export default firebaseService;
