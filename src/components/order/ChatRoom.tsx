import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ParticipantType, MessageType } from '../../pages/order/order-types';
import deliveryChatService, { ChatMessage, ChatParticipant } from '../../services/delivery-chat.service';

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

  // 소켓 연결 상태
  const [isConnected, setIsConnected] = useState<boolean>(true);
  
  // 참여자 이름 찾기 유틸리티
  const getParticipantName = useCallback((senderId: string) => {
    const participant = localParticipants.find(p => 
      p.id === senderId || 
      (p.userId !== undefined && p.userId.toString() === senderId) ||
      (p.user && p.user.id && p.user.id.toString() === senderId)
    );
    if (participant) {
      // 이름 정보를 찾는 여러 방법 시도
      if (participant.name) {
        return participant.name;
      } else if (participant.user && participant.user.nickname) {
        return participant.user.nickname; // UserType은 nickname을 사용함
      }
    }
    return '알 수 없음';
  }, [localParticipants]);
  
  // 채팅방 입장
  useEffect(() => {
    console.log('소켓을 통해 채팅방 입장 시도 | 방 ID:', roomId);
    
    deliveryChatService.joinRoom(roomId)
      .then(() => {
        console.log('채팅방 입장 성공');
        setIsConnected(true);
      })
      .catch(error => {
        console.error('채팅방 입장 실패:', error);
        setIsConnected(false);
      });
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      console.log('채팅방 나가기 처리');
      deliveryChatService.leaveRoom(roomId)
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
        const chatMessages = await deliveryChatService.getMessages(roomId);
        
        // 소켓 메시지를 UI 메시지로 변환
        const transformedMessages = (chatMessages || []).map(msg => ({
          id: msg.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          senderId: msg.userId || '',
          senderName: msg.user?.name || '',
          content: msg.message || '',
          timestamp: msg.createdAt || new Date().toISOString(),
          roomId: msg.deliveryRoomId || roomId,
          isFromCurrentUser: msg.isFromCurrentUser || msg.userId === currentUserId.toString()
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
    
    // 소켓 이벤트 핸들러 정의
    const handleNewMessage = (newMsg: ChatMessage) => {
      console.log('[ChatRoom] 실시간 메시지 수신:', newMsg);
      
      // 메시지 내용 유효성 검사
      if (!newMsg.message || !newMsg.userId) {
        console.warn('유효하지 않은 메시지 수신됨, 무시함:', newMsg);
        return;
      }
      
      // 메시지 객체 변환
      const transformedMsg: MessageType = {
        id: newMsg.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        senderId: newMsg.userId,
        senderName: newMsg.user?.name || getParticipantName(newMsg.userId),
        content: newMsg.message,
        timestamp: newMsg.createdAt || new Date().toISOString(),
        roomId: newMsg.deliveryRoomId,
        isFromCurrentUser: newMsg.userId === currentUserId.toString()
      };
      
      // 중복 메시지 방지 처리
      setMessages(prevMsgs => {
        if (prevMsgs.some(msg => msg.id === transformedMsg.id)) {
          return prevMsgs;
        }
        
        // 자동 스크롤
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        
        return [...prevMsgs, transformedMsg];
      });
    };
    
    // 참여자 목록 업데이트 핸들러
    const handleParticipantsUpdated = (participants: ChatParticipant[]) => {
      console.log('[ChatRoom] 참여자 목록 업데이트:', participants.length);
      
      // 서버 데이터를 UI 형식으로 변환
      const transformedParticipants = participants.map(p => ({
        id: p.id,
        userId: parseInt(p.userId, 10) || 0,
        deliveryRoomId: p.deliveryRoomId,
        joinedAt: p.createdAt || new Date().toISOString(),
        isPaid: false,
        amount: p.amount || 0,
        orderDetails: p.orderDetails || '',
        name: p.user?.name || '',
        user: {
          id: p.user?.id || 0,
          nickname: p.user?.name || '',
          kakaoId: ''
        }
      }));
      
      setLocalParticipants(transformedParticipants);
    };
    
    // 소켓 이벤트 리스너 등록
    deliveryChatService.onNewMessage(roomId, handleNewMessage);
    deliveryChatService.onParticipantsUpdated(roomId, handleParticipantsUpdated);
    
    // 컴포넌트 언마운트 시 리스너 정리 
    return () => {
      console.log('채팅방 리스너 정리');
      // Socket.IO는 룸 이동 시 자동으로 이전 리스너가 정리됨
    };
  }, [roomId, currentUserId, getParticipantName]);
  
  // 새 메시지 스크롤 처리
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // 메시지 전송 처리
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !isConnected) return;
    
    try {
      // 임시 ID 생성
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // UI에 즉시 반영 (낙관적 UI 업데이트)
      const tempMessage: MessageType = {
        id: tempId,
        senderId: currentUserId,
        senderName: '나', // 현재 사용자 이름
        content: newMessage,
        timestamp: new Date().toISOString(),
        roomId,
        isFromCurrentUser: true
      };
      
      setMessages(prev => [...prev, tempMessage]);
      
      // 입력 필드 초기화
      setNewMessage('');
      
      // 서버로 메시지 전송
      await deliveryChatService.sendMessage(roomId, newMessage);
      
      // 메시지 전송 성공 후 추가 작업 (필요한 경우)
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다.');
    }
  }, [newMessage, roomId, currentUserId, isConnected]);
  
  // 키보드 핸들러 - Enter 키로 메시지 전송
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <h2>채팅</h2>
        <CloseButton onClick={onClose}>X</CloseButton>
      </ChatHeader>
      
      <ChatContent>
        {loading ? (
          <LoadingText>메시지 로드 중...</LoadingText>
        ) : messages.length === 0 ? (
          <NoMessages>아직 메시지가 없습니다. 첫 메시지를 보내보세요!</NoMessages>
        ) : (
          <MessageList>
            {messages.map((message) => (
              <MessageItem 
                key={`${message.id}-${message.senderId}-${Math.random().toString(36).substring(2, 9)}`} 
                $isCurrentUser={message.isFromCurrentUser || false}
              >
                <MessageHeader>
                  <strong>{message.senderName || getParticipantName(message.senderId)}</strong>
                  <span>{new Date(message.timestamp || Date.now()).toLocaleTimeString()}</span>
                </MessageHeader>
                <MessageBody $isCurrentUser={message.isFromCurrentUser || false}>
                  {message.content || ''}
                </MessageBody>
              </MessageItem>
            ))}
            <div ref={messagesEndRef} />
          </MessageList>
        )}
      </ChatContent>
      
      <ChatInputArea>
        <ConnectionStatus $isConnected={isConnected}>
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
          <SendButton 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
          >
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
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  
  h2 {
    margin: 0;
    font-size: 1.2rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ChatContent = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #fff;
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

const LoadingText = styled.div`
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

const MessageItem = styled.div<{ $isCurrentUser: boolean }>`
  max-width: 70%;
  margin-bottom: 10px;
  align-self: ${props => props.$isCurrentUser ? 'flex-end' : 'flex-start'};
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

const MessageBody = styled.div<{ $isCurrentUser: boolean }>`
  padding: 8px 12px;
  border-radius: 12px;
  background-color: ${props => props.$isCurrentUser ? '#007bff' : '#f1f1f1'};
  color: ${props => props.$isCurrentUser ? '#fff' : '#333'};
  word-break: break-word;
`;

const ChatInputArea = styled.div`
  padding: 10px;
  background-color: #f8f9fa;
  border-top: 1px solid #ddd;
`;

const ConnectionStatus = styled.div<{ $isConnected: boolean }>`
  font-size: 12px;
  text-align: right;
  margin-bottom: 5px;
  color: ${props => props.$isConnected ? 'green' : 'red'};
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
