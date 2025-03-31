import { useState, useEffect, useCallback, useRef } from 'react'
import deliveryChatService from '../../api/deliveryChatApi'
import { ChatMessage } from '../../types/delivery'

interface UseDeliveryChatProps {
  roomId: string
  autoConnect?: boolean
}

interface UseDeliveryChatResult {
  messages: ChatMessage[]
  sendMessage: (message: string) => void
  isConnected: boolean
  roomUsers: Array<{ userId: string; nickname: string }>
  connect: () => void
  disconnect: () => void
}

export const useDeliveryChat = ({
  roomId,
  autoConnect = true,
}: UseDeliveryChatProps): UseDeliveryChatResult => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [roomUsers, setRoomUsers] = useState<
    Array<{ userId: string; nickname: string }>
  >([])
  const socketRef = useRef(deliveryChatService)

  // 채팅 연결
  const connect = useCallback(() => {
    const socket = socketRef.current.connect()

    // 소켓 연결 성공 시
    socket.on('connect', () => {
      setIsConnected(true)
      socketRef.current.joinRoom(roomId, (chatHistory) => {
        setMessages(chatHistory)
      })
      socketRef.current.getRoomUsers(roomId, (data) => {
        setRoomUsers(data.users)
      })
    })

    // 소켓 연결 해제 시
    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    // 새 메시지 수신 시
    socketRef.current.onNewMessage((message) => {
      setMessages((prev) => [...prev, message])
    })

    // 사용자 입장 시
    socketRef.current.onUserJoined((data) => {
      // 방 사용자 목록 업데이트
      socketRef.current.getRoomUsers(roomId, (usersData) => {
        setRoomUsers(usersData.users)
      })
    })

    // 사용자 퇴장 시
    socketRef.current.onUserLeft((data) => {
      // 방 사용자 목록 업데이트
      socketRef.current.getRoomUsers(roomId, (usersData) => {
        setRoomUsers(usersData.users)
      })
    })

    // 에러 발생 시
    socketRef.current.onError((data) => {
      console.error('Chat error:', data.message)
    })
  }, [roomId])

  // 채팅 연결 해제
  const disconnect = useCallback(() => {
    if (isConnected) {
      socketRef.current.leaveRoom(roomId)
      socketRef.current.disconnect()
      setIsConnected(false)
    }
  }, [roomId, isConnected])

  // 메시지 전송
  const sendMessage = useCallback(
    (message: string) => {
      if (isConnected && message.trim()) {
        socketRef.current.sendMessage(roomId, message)
      }
    },
    [roomId, isConnected],
  )

  // 컴포넌트 마운트 시 연결, 언마운트 시 연결 해제
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    // cleanup function
    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  return {
    messages,
    sendMessage,
    isConnected,
    roomUsers,
    connect,
    disconnect,
  }
}
