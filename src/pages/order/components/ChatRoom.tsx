import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { ParticipantType, MessageType } from '../order-types'

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getCurrentUser = () => {
    return participants.find((p) => p.id === currentUserId)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const currentUser = getCurrentUser()
    if (!currentUser) return

    const newMsg: MessageType = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUser.name,
      content: newMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, newMsg])
    setNewMessage('')
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
  }

  const getSenderName = (senderId: string) => {
    const sender = participants.find((p) => p.id === senderId)
    return sender ? sender.name : '알 수 없음'
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <ParticipantCount>참여자 {participants.length}명</ParticipantCount>
        <CloseButton onClick={onClose}>X</CloseButton>
      </ChatHeader>
      <MessagesContainer>
        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId
          return (
            <MessageItem key={message.id} isCurrentUser={isCurrentUser}>
              {!isCurrentUser && (
                <SenderAvatar>
                  {getSenderName(message.senderId).charAt(0).toUpperCase()}
                </SenderAvatar>
              )}
              <MessageContent isCurrentUser={isCurrentUser}>
                {!isCurrentUser && (
                  <SenderName>{getSenderName(message.senderId)}</SenderName>
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
        })}
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
