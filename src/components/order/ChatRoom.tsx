import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ParticipantType, MessageType } from '../../pages/order/order-types';
import firebaseService, { FirebaseMessage, FirebaseParticipant } from '../../services/firebase.service';

interface ChatRoomProps {
  roomId: string;
  participants: ParticipantType[];
  currentUserId: string;
  onClose: () => void;
}

// 타임스태프를 Date 객체로 변환하는 유틸리티 함수
const convertTimestampToDate = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  
  if (timestamp instanceof Date) {
    return timestamp;
  } else if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
    // Firestore 형식 타임스태프 객체
    return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
  } else if (typeof timestamp === 'number') {
    return new Date(timestamp);
  } else if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  
  return new Date();
};

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, participants: initialParticipants, currentUserId, onClose }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [localParticipants, setLocalParticipants] = useState<ParticipantType[]>(initialParticipants);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Firebase 연결 상태
  const [isConnected, setIsConnected] = useState<boolean>(true);
  
  // 채팅방 입장
  useEffect(() => {
    console.log('Firebase를 통해 채팅방 입장 시도 | 방 ID:', roomId);
    
    firebaseService.joinRoom(roomId)
      .then(() => {
        console.log('채팅방 입장 성공');
        // 입장 메시지 전송 제거 (사용자 요청에 따라)
      })
      .catch(error => {
        console.error('채팅방 입장 실패:', error);
        setIsConnected(false);
      });
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      console.log('채팅방 나가기 처리');
      firebaseService.leaveRoom(roomId)
        .catch(error => console.error('채팅방 나가기 실패:', error));
    };
  }, [roomId]);
  
  // 메시지 히스토리 로드 및 실시간 리스너 설정
  useEffect(() => {
    // 서버사이드 렌더링 엔진에서는 실행하지 않음
    if (typeof window === 'undefined') return;
    
    // 메시지 히스토리 로드
    const loadMessages = async () => {
      try {
        setLoading(true);
        const firebaseMsgs = await firebaseService.getMessages(roomId);
        
        // Firebase 메시지를 UI 메시지로 변환 (널 체크 추가)
        const transformedMessages = (firebaseMsgs || []).map(msg => ({
          id: msg.id || `temp-${Date.now()}-${Math.random()}`,
          senderId: msg.senderId || '',
          senderName: msg.senderName || '',
          content: msg.content || '',
          timestamp: msg.timestamp ? convertTimestampToDate(msg.timestamp).toISOString() : new Date().toISOString(),
          roomId: msg.deliveryRoomId || roomId,
          isFromCurrentUser: msg.senderId === currentUserId
        }));
        
        setMessages(transformedMessages);
      } catch (error) {
        console.error('메시지 로드 실패:', error);
        // 오류 발생 시 기본 값으로 설정
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    
    // 메시지 로드 실행
    loadMessages();
    
    // 실시간 메시지 수신 리스너 설정
    const unsubscribeMessages = firebaseService.onNewMessages(roomId, (newMessage) => {
      console.log('[ChatRoom] 실시간 메시지 수신:', newMessage);
      
      // 실시간 메시지 객체 디버깅
      console.log('[ChatRoom] 메시지 상세 정보:', {
        id: newMessage.id,
        senderId: newMessage.senderId,
        content: newMessage.content,
        timestamp: newMessage.timestamp,
        deliveryRoomId: newMessage.deliveryRoomId
      });
      
      // 메시지 중복 여부 확인 - 개선된 중복 처리 로직
      setMessages(prevMessages => {
        // 1. 임시 ID가 아닌 경우에만 중복 체크 수행
        if (newMessage.id && !newMessage.id.toString().startsWith('temp-')) {
          const existingMsgIndex = prevMessages.findIndex(msg => 
            msg.id === newMessage.id || 
            (msg.id.toString().startsWith('temp-') && 
             msg.content === newMessage.content && 
             msg.senderId === newMessage.senderId)
          );
          
          // 이미 존재하는 메시지인 경우
          if (existingMsgIndex >= 0) {
            // 이미 받은 메시지가 임시 ID이고 새 메시지가 실제 ID인 경우, 임시 ID를 실제 ID로 대체
            if (prevMessages[existingMsgIndex].id.toString().startsWith('temp-')) {
              console.log(`[ChatRoom] 임시 ID를 실제 ID로 대체: ${prevMessages[existingMsgIndex].id} -> ${newMessage.id}`);
              const updatedMessages = [...prevMessages];
              updatedMessages[existingMsgIndex] = {
                ...updatedMessages[existingMsgIndex],
                id: newMessage.id
              };
              return updatedMessages;
            }
            
            console.log(`[ChatRoom] 메시지 중복 방지 - ID: ${newMessage.id}`);
            return prevMessages; // 중복된 메시지는 무시
          }
        }
        
        // 2. 새 메시지 생성 및 추가
        const transformedMessage: MessageType = {
          id: newMessage.id || `temp-${Date.now()}`, // ID가 없을 경우 임시 ID 생성
          senderId: newMessage.senderId,
          senderName: newMessage.senderName,
          content: newMessage.content,
          timestamp: convertTimestampToDate(newMessage.timestamp).toISOString(),
          roomId: newMessage.deliveryRoomId || roomId, // 누락된 경우 현재 룸 ID 사용
          isFromCurrentUser: newMessage.senderId === currentUserId
        };
        
        // 메시지 정보 로깅 - 머리글/풀이 기능 확인
        console.log(`[ChatRoom] 새 메시지 (내 메시지: ${transformedMessage.isFromCurrentUser}):`, transformedMessage.content);
        
        // 3. 자동 스크롤 처리
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        
        return [...prevMessages, transformedMessage];
      });
    });
    
    // 참여자 상태 리스너 설정
    const unsubscribeParticipants = firebaseService.onParticipantsUpdated(roomId, (participants) => {
      // 참여자 목록 업데이트 시 처리
      const transformedParticipants = participants.map(participant => {
        const partObj: ParticipantType = {
          id: participant.id,
          userId: Number(participant.id), // ID를 숫자로 변환
          name: participant.name,
          avatar: participant.avatar,
          deliveryRoomId: roomId,
          joinedAt: convertTimestampToDate(participant.lastActive).toISOString(),
          isPaid: false, // 기본값으로 false 설정
          amount: 0,
          orderDetails: ''
        };
        return partObj;
      });
      
      setLocalParticipants(transformedParticipants);
    });
    
    // 클린업 함수
    return () => {
      unsubscribeMessages();
      unsubscribeParticipants();
    };
  }, [roomId, currentUserId]);
  
  // 새 메시지 전송
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !isConnected) return;
    
    try {
      // 메시지 전송
      const sentMessage = await firebaseService.sendMessage(roomId, newMessage);
      
      // Firebase에서 응답을 기다리지 않고 UI에 즉시 반영
      const currentUser = await firebaseService.getCurrentUser();
      const newLocalMessage: MessageType = {
        id: sentMessage?.id || `temp-${Date.now()}`,
        senderId: currentUser.id.toString(),
        senderName: currentUser.name,
        content: newMessage,
        timestamp: new Date().toISOString(),
        roomId: roomId,
        isFromCurrentUser: true
      };
      
      // 즉시 UI에 메시지 추가
      setMessages(prevMessages => [...prevMessages, newLocalMessage]);
      
      // 입력 필드 초기화
      setNewMessage('');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  }, [newMessage, roomId, isConnected]);
  
  // 엔터 키로 메시지 전송
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  // 메시지 도착 시 스크롤 아래로 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // 참여자 정보 업데이트 (예: 사용자 이름 표시)
  const getParticipantName = useCallback((senderId: string) => {
    const participant = localParticipants.find(p => p.id === senderId);
    return participant?.name || '알 수 없음';
  }, [localParticipants]);
  
  return (
    <ChatContainer>
      <ChatHeader>
        <h3>채팅방 ({localParticipants.length}명)</h3>
        <CloseButton onClick={onClose}>×</CloseButton>
      </ChatHeader>
      
      <ChatContent>
        {loading ? (
          <LoadingMessage>메시지 로딩 중...</LoadingMessage>
        ) : messages.length === 0 ? (
          <NoMessages>아직 메시지가 없습니다. 첫 메시지를 보내보세요!</NoMessages>
        ) : (
          <MessageList>
            {messages.map((message) => (
              <MessageItem 
                key={`${message.id}-${message.timestamp}`} 
                isCurrentUser={message.isFromCurrentUser || false}
              >
                <MessageHeader>
                  <strong>{message.senderName || getParticipantName(message.senderId)}</strong>
                  <span>{new Date(message.timestamp || Date.now()).toLocaleTimeString()}</span>
                </MessageHeader>
                <MessageBody isCurrentUser={message.isFromCurrentUser || false}>
                  {message.content || ''}
                </MessageBody>
              </MessageItem>
            ))}
            <div ref={messagesEndRef} />
          </MessageList>
        )}
      </ChatContent>
      
      <ChatInputArea>
        <ConnectionStatus isConnected={isConnected}>
          {isConnected ? '🟢 연결됨' : '🔴 연결 끊김'}
        </ConnectionStatus>
        <InputWrapper>
          <ChatInput 
            type="text" 
            placeholder="메시지 입력..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
          />
          <SendButton onClick={handleSendMessage} disabled={!isConnected || !newMessage.trim()}>
            전송
          </SendButton>
        </InputWrapper>
      </ChatInputArea>
    </ChatContainer>
  );
};

// 스타일 컴포넌트
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 450px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 16px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  
  &:hover {
    color: #333;
  }
`;

const ChatContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #fff;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
`;

const NoMessages = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
  text-align: center;
  padding: 20px;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
`;

const MessageItem = styled.div<{ isCurrentUser: boolean }>`
  max-width: 70%;
  margin-bottom: 10px;
  align-self: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
  
  span {
    color: #999;
    margin-left: 8px;
  }
`;

const MessageBody = styled.div<{ isCurrentUser: boolean }>`
  padding: 8px 12px;
  border-radius: 12px;
  background-color: ${props => props.isCurrentUser ? '#007bff' : '#f1f1f1'};
  color: ${props => props.isCurrentUser ? '#fff' : '#333'};
  word-break: break-word;
`;

const ChatInputArea = styled.div`
  padding: 10px;
  background-color: #f8f9fa;
  border-top: 1px solid #ddd;
`;

const ConnectionStatus = styled.div<{ isConnected: boolean }>`
  font-size: 12px;
  text-align: right;
  margin-bottom: 5px;
  color: ${props => props.isConnected ? 'green' : 'red'};
`;

const InputWrapper = styled.div`
  display: flex;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  
  &:focus {
    border-color: #007bff;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: 8px 16px;
  margin-left: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background-color: #0069d9;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

export default ChatRoom;
