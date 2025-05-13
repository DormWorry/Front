import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { ParticipantType, MessageType } from '../order-types'
import socketService from '../../../services/socket.service'
import deliveryRoomApi from '../../../api/deliveryRoom'

interface ChatRoomProps {
  roomId: string
  participants: ParticipantType[]
  currentUserId: string
  onClose: () => void
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  roomId,
  participants,
  currentUserId,
  onClose,
}) => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState<boolean>(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 소켓 연결 상태 확인
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  
  // 소켓 연결 초기화 및 채팅방 입장
  useEffect(() => {
    // 채팅 기능을 위한 소켓 초기화 - 연결 여부와 관계없이 항상 실행
    console.log('채팅용 소켓 연결 및 방 입장 시도 | 방 ID:', roomId);
    
    // 1. 소켓 연결 확인/시도
    const socket = socketService.connect();
    setSocketConnected(!!socket);
    
    // 2. 방 입장 - 각별 소켓에 이 거드워를 통해 메시지를 전달
    if (socket) {
      console.log('채팅방 입장 시도 - 소켓 이벤트 발생: joinRoom ->', roomId);
      socketService.emit('joinRoom', { deliveryRoomId: roomId });
      
      // 방 입장 확인 메시지 발송 - 서버에서 모든 사용자에게 알림
      socketService.emit('sendMessage', {
        roomId: roomId,
        message: '💬 채팅방에 입장했습니다.'
      });
    }
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      console.log('채팅방 나가기 처리');
      socketService.off('joinRoom');
    };
  }, [roomId]);  // roomId가 변경될 때마다 다시 연결
  
  // 소켓 이벤트 리스너 및 메시지 로드
  useEffect(() => {
    console.log('채팅 메시지 리스너 설정 및 기존 메시지 로드');
    
    // 1. 기존 메시지 로드
    const loadMessages = async () => {
      try {
        setLoading(true);
        const msgs = await deliveryRoomApi.getMessages(roomId);
        console.log('채팅 메시지 로드 성공:', msgs?.length || 0);
        setMessages(msgs || []);
      } catch (error) {
        console.error('채팅 메시지 로드 중 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    // 2. 소켓 이벤트 리스너 설정
    const handleNewMessage = (message: MessageType) => {
      console.log('🔔 실시간 새 메시지 수신:', message);
      if (message && message.content) {
        // 시간이 없는 경우, 현재 시간 추가
        if (!message.timestamp) {
          message.timestamp = new Date().toISOString();
        }
        // 메시지 ID가 없는 경우, 임의 ID 부여
        if (!message.id) {
          message.id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        
        // 메시지 상태 업데이트 - 중복 없이 추가
        setMessages(prev => {
          // 이미 동일한 ID의 메시지가 있는지 확인
          if (message.id && prev.some(m => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    };

    // 이벤트 리스너 등록
    socketService.on('newMessage', handleNewMessage);
    
    // 오류 시에도 연결 유지를 위한 메시지 처리
    socketService.on('error', (error: any) => {
      console.error('소켓 오류 발생:', error);
      // 오류에도 불구하고 방 재입장 시도
      socketService.emit('joinRoom', { deliveryRoomId: roomId });
    });
    
    // 초기 메시지 로드
    loadMessages();

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      console.log('채팅 이벤트 리스너 제거');
      socketService.off('newMessage');
      socketService.off('error');
    };
  }, [roomId]);

  // 메시지가 변경될 때마다 스크롤 이동
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getCurrentUser = () => {
    return participants && participants.length > 0 ? participants.find((p) => p.id === currentUserId) : undefined
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = newMessage.trim();
    if (!messageText) return;
    
    // 메시지 입력창 매우 빠르게 초기화 - UI 응답성 향상
    setNewMessage('');

    console.log(`[채팅 메시지 전송] 시도 - 방 ID: ${roomId}, 내용: ${messageText}`);
    
    try {
      // 1. 로컬에 임시 메시지 추가 (낙관적 UI 업데이트)
      const tempId = `temp-${Date.now()}`;
      const tempMessage = {
        id: tempId,
        senderId: currentUserId,
        content: messageText,
        timestamp: new Date().toISOString()
      };
      
      // 추가 - 상태 갱신을 안정적으로 처리
      setMessages(prev => [...prev, tempMessage]);
      
      // 2. 초간단 지연 후 매우 실제적인 메시지 전송 시도
      setTimeout(() => {
        // 플래그를 통해 처리 중임을 표시
        console.log(`[채팅] 전송 시도 중...`);
        
        // 소켓 이벤트 발송 시 클리어한 형태로 데이터 전달
        socketService.emit('sendMessage', {
          roomId: roomId,  // 방 ID는 반드시 포함
          message: messageText // 메시지 내용
        });
        
        // 방 입장도 함께 보내서 현재 채팅방에 연결되어 있는지 확인
        socketService.emit('joinRoom', { deliveryRoomId: roomId });
      }, 10); // 지연이 처리되도록 짧은 지연 추가
      
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      // 사용자에게는 알리지 않고 업데이트만 취소
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
  }

  // 발신자가 자신인지 확인하는 함수 - 완전히 확장된 버전
  const isMessageFromCurrentUser = (senderId: string) => {
    // 현재 사용자 ID와 직접 비교
    if (senderId === currentUserId) {
      console.log('확인 1: 발신자 ID == 현재 사용자 ID');
      return true;
    }
    
    try {
      // 현재 사용자 정보 추출 (여러 방법 시도)
      let myUserId: number | string | null = null;
      let myParticipantId: string | null = null;
      
      // 1. 현재 사용자의 참여자 객체 찾기
      const currentParticipant = participants.find(p => p.id === currentUserId);
      if (currentParticipant) {
        myParticipantId = currentParticipant.id;
        
        // 중첩된 user 객체에서 ID 추출
        if (currentParticipant.user) {
          myUserId = currentParticipant.user.id;
        }
        // 직접 userId에서 추출
        else if (currentParticipant.userId) {
          myUserId = currentParticipant.userId;
        }
      }
      
      // 2. 참여자 목록에서 userId가 나의 것과 같은 참여자 찾기
      if (!myUserId) {
        // userId에 따른 참여자 추출 시도
        const otherParticipant = participants.find(p => p.userId === Number(currentUserId));
        if (otherParticipant) {
          myParticipantId = otherParticipant.id;
          myUserId = otherParticipant.userId;
        }
      }
      
      // 내 사용자 정보 출력 (디버깅)
      console.log('확인: 내 사용자 정보', { 
        currentUserId,
        myUserId, 
        myParticipantId,
        isNumeric: !isNaN(Number(senderId))
      });
      
      // 분류 3: 메시지의 senderId가 사용자 ID와 매칭
      if (myUserId && senderId === myUserId.toString()) {
        console.log('확인 2: 메시지 발신자 ID == 내 사용자 ID');
        return true;
      }
      
      // 분류 4: 메시지의 senderId가 참여자 ID와 매칭
      if (myParticipantId && senderId === myParticipantId) {
        console.log('확인 3: 메시지 발신자 ID == 내 참여자 ID');
        return true;
      }
      
      // 분류 5: 순전히 숫자 매칭 (대부분 백엔드에서 user.id)
      if (myUserId && !isNaN(Number(senderId)) && Number(myUserId) === Number(senderId)) {
        console.log('확인 4: 메시지 발신자 ID(숫자형) == 내 사용자 ID(숫자형)');
        return true;
      }
      
      // 분류 6: 마지막 시도 - 모든 참여자의 모든 ID 값과 순차 테스트
      for (const participant of participants) {
        // 모든 ID 값을 추출하여 비교
        const allIds = [
          participant.id, 
          participant.userId?.toString(),
          participant.user?.id?.toString(),
          participant.user?.kakaoId
        ].filter(Boolean); // null/undefined 필터링
        
        // 현재 사용자의 모든 ID와 매칭하는지 확인
        const isCurrentUserParticipant = allIds.includes(currentUserId);
        
        if (isCurrentUserParticipant && allIds.includes(senderId)) {
          console.log('확인 5: 본인 참여자의 다양한 ID 중 하나와 메시지 발신자 ID 일치');
          return true;
        }
      }
      
      console.log('메시지 발신자는 내가 아님:', senderId);
      return false;
      
    } catch (error) {
      console.error('발신자 확인 중 오류:', error);
      // 오류 발생시 기본적으로 아닌 것으로 간주
      return false;
    }
  };
  
  const getSenderName = (senderId: string) => {
    if (!participants || participants.length === 0) {
      console.log(`참여자 없음: 발신자 ID ${senderId} 의 이름을 찾을 수 없음`);
      return '알 수 없음';
    }

    // 발신자 ID와 참여자 ID의 매칭을 디버그
    console.log('참여자 ID 목록:', participants.map(p => ({ id: p.id, userId: p.userId })));
    console.log('찾는 발신자 ID:', senderId);
    
    // 멤버 식별 방법 1: 참여자 ID와 일치
    let sender = participants.find(p => p.id === senderId);
    
    // 멤버 식별 방법 2: 사용자 ID(숫자)와 일치
    if (!sender && !isNaN(Number(senderId))) {
      sender = participants.find(p => p.userId === Number(senderId));
    }
    
    // 멤버 식별 방법 3: 내부 user 객체의 ID와 일치
    if (!sender) {
      sender = participants.find(p => p.user && p.user.id.toString() === senderId);
    }
    
    // 발신자 정보 확인
    if (sender) {
      // 사용자 이름 처리
      const userName = sender.user?.nickname || sender.name || '익명';
      return userName;
    }
    
    // 일치하는 참여자가 없는 경우 문제 추적을 위한 로그
    console.warn(`발신자 찾기 실패: ID ${senderId}를 가진 참여자를 찾을 수 없음`);
    return '알 수 없음';
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <ParticipantCount>참여자 {participants && participants.length || 0}명</ParticipantCount>
        <CloseButton onClick={onClose}>X</CloseButton>
      </ChatHeader>
      <MessagesContainer>
        {loading ? (
          <LoadingMessage>메시지를 불러오는 중...</LoadingMessage>
        ) : messages.length === 0 ? (
          <EmptyMessage>아직 메시지가 없습니다. 첫 메시지를 보내보세요!</EmptyMessage>
        ) : (
          messages.map((message) => {
            // 개선된 발신자 확인 방법 적용
            const isCurrentUser = isMessageFromCurrentUser(message.senderId);
            
            // 발신자 이름 가져오기
            const senderName = isCurrentUser ? '나' : getSenderName(message.senderId);
            
            // 메시지 분석 (테스트용 로깅)
            console.log(`메시지 [${message.id}]: 발신자=${message.senderId}, 내가 보낸 것=${isCurrentUser}`);
            
            return (
              <MessageItem key={message.id} isCurrentUser={isCurrentUser}>
                {!isCurrentUser && (
                  <SenderAvatar>
                    {senderName.charAt(0).toUpperCase()}
                  </SenderAvatar>
                )}
                <MessageContent isCurrentUser={isCurrentUser}>
                  {!isCurrentUser && (
                    <SenderName>{senderName}</SenderName>
                  )}
                  <MessageText isCurrentUser={isCurrentUser}>
                    {message.content}
                  </MessageText>
                  <MessageTime isCurrentUser={isCurrentUser}>
                    {formatTime(message.timestamp)}
                  </MessageTime>
                </MessageContent>
              </MessageItem>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <MessageInputForm onSubmit={handleSendMessage}>
        <MessageInput
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <SendButton type="submit" disabled={!newMessage.trim()}>
          전송
        </SendButton>
      </MessageInputForm>
    </ChatContainer>
  )
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
  background-color: #f8f9fa;
`

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #13cfb8;
  color: white;
`

const ParticipantCount = styled.div`
  font-weight: 500;
  color: #444;
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  font-size: 14px;
  padding: 20px;
`

const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  font-size: 14px;
  padding: 20px;
  text-align: center;
`

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
`

const MessageItem = styled.div<{ isCurrentUser: boolean }>`
  display: flex;
  flex-direction: ${({ isCurrentUser }) => (isCurrentUser ? 'row-reverse' : 'row')};
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 4px;
`

const SenderAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #4dabf7;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
`

const MessageContent = styled.div<{ isCurrentUser: boolean }>`
  display: flex;
  flex-direction: column;
  max-width: 70%;
  ${({ isCurrentUser }) => isCurrentUser && 'align-items: flex-end;'}
`

const SenderName = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  margin-left: 4px;
`

const MessageText = styled.div<{ isCurrentUser: boolean }>`
  padding: 10px 14px;
  border-radius: 16px;
  color: ${({ isCurrentUser }) => (isCurrentUser ? 'white' : '#444')};
  background-color: ${({ isCurrentUser }) => (isCurrentUser ? '#13cfb8' : 'white')};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-break: break-word;
  line-height: 1.4;
`

const MessageTime = styled.div<{ isCurrentUser: boolean }>`
  font-size: 11px;
  color: #888;
  margin-top: 4px;
  ${({ isCurrentUser }) => isCurrentUser ? 'margin-right: 4px;' : 'margin-left: 4px;'}
`

const MessageInputForm = styled.form`
  display: flex;
  padding: 12px 0 0 0;
  gap: 8px;
`

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 14px;
  color: #444;
  background-color: #f8f9fa;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #13cfb8;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(19, 207, 184, 0.1);
  }
  
  &::placeholder {
    color: #aaa;
  }
`

const SendButton = styled.button`
  background-color: #13cfb8;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #10b9a5;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #ddd;
    color: #999;
    cursor: not-allowed;
    transform: none;
  }
`

export default ChatRoom
