# 배달 기능 API 사용법 가이드

이 문서는 배달 기능 구현에 필요한 API와 훅(Hooks)을 설명합니다.

## 설치 방법

프로젝트에 필요한 패키지를 설치하세요:

```bash
# Axios 설치 (API 요청용)
npm install axios

# Socket.io 클라이언트 설치 (실시간 채팅용)
npm install socket.io-client
```

## API 서비스

배달 기능은 다음 3개의 API 서비스로 구성됩니다:

1. `deliveryRoomApi` - 배달방 관련 API
2. `deliveryParticipantApi` - 배달 참가자 관련 API
3. `deliveryChatService` - 배달 채팅 관련 API

## React 훅(Hooks)

배달 기능에 사용되는 주요 훅들:

1. `useDeliveryRooms` - 배달방 목록 조회
2. `useDeliveryRoomDetail` - 배달방 상세 정보 및 참여 기능
3. `useDeliveryChat` - 배달방 채팅 기능

## 사용 예시

### 1. 배달방 목록 조회

```tsx
import React from 'react'
import { useDeliveryRooms } from '../hooks/delivery/useDeliveryRooms'
import { FoodCategory } from '../constants/category'

const DeliveryRoomList: React.FC = () => {
  const { rooms, loading, error, fetchRooms, categories } = useDeliveryRooms()

  // 카테고리별 필터링
  const handleCategoryFilter = (category: string) => {
    fetchRooms({ category })
  }

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>오류 발생: {error.message}</div>

  return (
    <div>
      <h1>배달 참여하기</h1>

      <div className="categories">
        {categories.map((cat) => (
          <button key={cat.key} onClick={() => handleCategoryFilter(cat.name)}>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="rooms-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <h3>{room.restaurantName}</h3>
            <p>카테고리: {room.category}</p>
            <p>최소주문금액: {room.minimumOrderAmount}원</p>
            <p>배달비: {room.deliveryFee}원</p>
            <p>{room.description}</p>
            <a href={`/delivery/room/${room.id}`}>자세히 보기</a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeliveryRoomList
```

### 2. 배달방 생성

```tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import deliveryRoomApi, { CreateDeliveryRoomDto } from '../api/deliveryRoomApi'
import { FoodCategory } from '../constants/category'

const CreateDeliveryRoom: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<CreateDeliveryRoomDto>({
    restaurantName: '',
    category: FoodCategory.CHICKEN,
    minimumOrderAmount: 15000,
    deliveryFee: 3000,
    description: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'minimumOrderAmount' || name === 'deliveryFee'
          ? parseInt(value)
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newRoom = await deliveryRoomApi.createRoom(formData)
      alert('배달 방이 생성되었습니다!')
      navigate(`/delivery/room/${newRoom.id}`)
    } catch (error) {
      console.error('배달방 생성 중 오류 발생:', error)
      alert('배달방 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>배달 방 만들기</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>식당 이름</label>
          <input
            type="text"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>카테고리</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {Object.values(FoodCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>최소 주문 금액</label>
          <input
            type="number"
            name="minimumOrderAmount"
            value={formData.minimumOrderAmount}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>배달비</label>
          <input
            type="number"
            name="deliveryFee"
            value={formData.deliveryFee}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>설명</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? '처리 중...' : '배달 방 만들기'}
        </button>
      </form>
    </div>
  )
}

export default CreateDeliveryRoom
```

### 3. 배달방 상세 및 참여

```tsx
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDeliveryRoomDetail } from '../hooks/delivery/useDeliveryRoomDetail'
import { useDeliveryChat } from '../hooks/delivery/useDeliveryChat'
import { DeliveryRoomStatus } from '../types/delivery'

const DeliveryRoomDetail: React.FC = () => {
  const { roomId = '' } = useParams<{ roomId: string }>()
  const {
    room,
    participants,
    loading,
    error,
    joinRoom,
    updateRoomStatus,
    togglePaymentStatus,
    leaveRoom,
  } = useDeliveryRoomDetail({ roomId })

  const { messages, sendMessage, isConnected, roomUsers } = useDeliveryChat({
    roomId,
  })

  const [orderDetails, setOrderDetails] = useState('')
  const [amount, setAmount] = useState(0)
  const [message, setMessage] = useState('')

  // 내 참여자 ID 찾기 (예시, 실제로는 로그인 정보와 비교해야 함)
  const currentUserId = 'current-user-id' // 현재 로그인한 사용자 ID
  const myParticipation = participants.find((p) => p.userId === currentUserId)

  const handleJoinRoom = async () => {
    try {
      await joinRoom({
        orderDetails,
        amount,
      })
      alert('배달 방에 참가했습니다!')
      setOrderDetails('')
      setAmount(0)
    } catch (error) {
      alert('참가 중 오류가 발생했습니다.')
    }
  }

  const handleUpdateStatus = async (status: DeliveryRoomStatus) => {
    try {
      await updateRoomStatus(status)
      alert('방 상태가 변경되었습니다!')
    } catch (error) {
      alert('상태 변경 중 오류가 발생했습니다.')
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message)
      setMessage('')
    }
  }

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>오류 발생: {error.message}</div>
  if (!room) return <div>배달 방을 찾을 수 없습니다.</div>

  return (
    <div className="delivery-room-detail">
      <div className="room-info">
        <h1>{room.restaurantName}</h1>
        <p>카테고리: {room.category}</p>
        <p>최소주문금액: {room.minimumOrderAmount}원</p>
        <p>배달비: {room.deliveryFee}원</p>
        <p>상태: {room.status}</p>
        <p>설명: {room.description}</p>

        {/* 방장인 경우 상태 변경 버튼 표시 */}
        {room.creatorId === currentUserId &&
          room.status === DeliveryRoomStatus.OPEN && (
            <button
              onClick={() => handleUpdateStatus(DeliveryRoomStatus.CLOSED)}
            >
              주문 완료하기
            </button>
          )}
      </div>

      <div className="participants">
        <h2>참여자 목록</h2>
        <ul>
          {participants.map((participant) => (
            <li key={participant.id}>
              <p>사용자: {participant.user?.nickname}</p>
              <p>주문 내용: {participant.orderDetails}</p>
              <p>금액: {participant.amount}원</p>
              <p>결제 상태: {participant.isPaid ? '결제 완료' : '미결제'}</p>

              {/* 본인 또는 방장만 결제 상태 변경 가능 */}
              {(participant.userId === currentUserId ||
                room.creatorId === currentUserId) && (
                <button onClick={() => togglePaymentStatus(participant.id)}>
                  {participant.isPaid ? '미결제로 변경' : '결제 완료로 변경'}
                </button>
              )}

              {/* 본인이고 방이 열려있는 경우 나가기 버튼 표시 */}
              {participant.userId === currentUserId &&
                room.status === DeliveryRoomStatus.OPEN && (
                  <button onClick={() => leaveRoom(participant.id)}>
                    나가기
                  </button>
                )}
            </li>
          ))}
        </ul>
      </div>

      {/* 아직 참여하지 않았고 방이 열려있는 경우 참가 폼 표시 */}
      {!myParticipation && room.status === DeliveryRoomStatus.OPEN && (
        <div className="join-form">
          <h2>배달 참여하기</h2>
          <div>
            <label>주문 내용</label>
            <textarea
              value={orderDetails}
              onChange={(e) => setOrderDetails(e.target.value)}
              required
            />
          </div>
          <div>
            <label>금액</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              required
            />
          </div>
          <button onClick={handleJoinRoom}>참여하기</button>
        </div>
      )}

      {/* 채팅 섹션 */}
      <div className="chat-section">
        <h2>채팅</h2>
        <div className="messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.userId === currentUserId ? 'mine' : 'other'}`}
            >
              <span className="author">
                {msg.user?.nickname || '알 수 없음'}
              </span>
              <p>{msg.message}</p>
              <span className="time">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="메시지 입력..."
          />
          <button onClick={handleSendMessage}>전송</button>
        </div>

        <div className="online-users">
          <h3>접속 중인 사용자 ({roomUsers.length})</h3>
          <ul>
            {roomUsers.map((user) => (
              <li key={user.userId}>{user.nickname}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DeliveryRoomDetail
```

## API 구조 요약

### 배달방 API (`deliveryRoomApi`)

- `createRoom` - 배달방 생성
- `getAllRooms` - 모든 배달방 조회
- `getRoomsByCategory` - 카테고리별 배달방 조회
- `getAllCategories` - 카테고리 목록 조회
- `getMyRooms` - 내가 생성한 배달방 조회
- `getParticipatingRooms` - 내가 참여중인 배달방 조회
- `getRoomById` - 특정 배달방 조회
- `updateRoomStatus` - 배달방 상태 변경
- `deleteRoom` - 배달방 삭제

### 배달 참가자 API (`deliveryParticipantApi`)

- `joinRoom` - 배달방 참가
- `getParticipantsByRoomId` - 특정 방의 모든 참가자 조회
- `getParticipantById` - 특정 참가자 조회
- `updateParticipant` - 참가자 정보 수정
- `togglePaymentStatus` - 결제 상태 토글
- `leaveRoom` - 배달방 나가기

### 배달 채팅 API (`deliveryChatService`)

- `connect` - 채팅 연결
- `disconnect` - 채팅 연결 해제
- `joinRoom` - 채팅방 입장
- `leaveRoom` - 채팅방 퇴장
- `sendMessage` - 메시지 전송
- `getRoomUsers` - 방 참여자 목록 요청
- `onNewMessage` - 새 메시지 수신 이벤트
- `onUserJoined` - 사용자 입장 이벤트
- `onUserLeft` - 사용자 퇴장 이벤트
- `onError` - 에러 이벤트
