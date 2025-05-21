import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { OrderRoomType, ParticipantType } from '../order-types'
import ChatRoom from '../../../components/order/ChatRoom'
import { FOOD_CATEGORIES } from '../../../constants/foodCategories'
import deliveryRoomApi from '../../../api/deliveryRoom'
import socketService from '../../../services/socket.service'

interface RoomDetailProps {
  room: OrderRoomType
  currentUserId: string
  onBack: () => void
  onLeaveRoom: () => void
}

// 추가: 로컬 참여자 상태 인터페이스
interface LocalRoomState {
  participants: ParticipantType[]
  isJoined: boolean
}

const RoomDetail: React.FC<RoomDetailProps> = ({
  room,
  currentUserId,
  onBack,
  onLeaveRoom,
}) => {
  const [orderAmount, setOrderAmount] = useState<number>(0)
  const [menuItems, setMenuItems] = useState<string>('')
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false)

  // 추가: 로컬 방 상태 관리 (참여자 목록 실시간 관리)
  const [localRoomState, setLocalRoomState] = useState<LocalRoomState>(() => ({
    participants: room?.participants || [],
    isJoined:
      room?.participants?.some((p) => p && p.id === currentUserId) || false,
  }))

  // 소켓 연결 상태 확인
  const [socketConnected, setSocketConnected] = useState<boolean>(false)

  // 소켓 초기화 및 이벤트 리스너 설정
  useEffect(() => {
    console.log('방 상세 화면 소켓 연결 초기화 | 방 ID:', room?.id)

    // 소켓 연결 상태 확인 및 이벤트 관리
    const socket = socketService.connect()
    const isConnected = socketService.isConnectedToServer()
    setSocketConnected(isConnected)

    // 소켓 연결 상태 이벤트 등록 (재연결 대응)
    const connectionStateHandler = () => {
      setSocketConnected(socketService.isConnectedToServer())

      // 재연결이 이뤄질 경우, 방 재입장 자동화
      if (socketService.isConnectedToServer() && room?.id) {
        console.log('소켓 연결 감지 - 방 재입장 시도')
        socketService.joinRoom(room.id)

        // 참여자 정보 갱신 요청
        socketService.emit('getParticipants', { roomId: room.id })
      }
    }

    // 연결 상태 변경 리스너 등록
    socketService.on('connect', connectionStateHandler)
    socketService.on('disconnect', connectionStateHandler)
    socketService.on('connect_error', connectionStateHandler)

    // 참여자 변경 이벤트 구독
    socketService.on(
      'participantsUpdated',
      (updatedParticipants: ParticipantType[]) => {
        console.log('참여자 목록 업데이트 받음:', updatedParticipants)
        if (Array.isArray(updatedParticipants)) {
          setLocalRoomState((prev) => {
            // 참여자 정보와 현재 사용자 참여 여부 함께 확인 업데이트
            const isCurrentUserJoined = updatedParticipants.some(
              (p) =>
                p &&
                (p.id === currentUserId ||
                  (p.userId && p.userId.toString() === currentUserId) ||
                  (p.user && p.user.id.toString() === currentUserId)),
            )

            return {
              participants: updatedParticipants,
              isJoined: isCurrentUserJoined,
            }
          })
        }
      },
    )

    // 방 정보 변경 이벤트 구독
    socketService.on('roomUpdated', (updatedRoom: OrderRoomType) => {
      console.log('방 정보 업데이트 받음:', updatedRoom)
      if (updatedRoom && updatedRoom.participants) {
        setLocalRoomState((prev) => {
          // 참여자 정보와 현재 사용자 참여 여부 함께 확인 업데이트
          const isCurrentUserJoined = updatedRoom.participants.some(
            (p) =>
              p &&
              (p.id === currentUserId ||
                (p.userId && p.userId.toString() === currentUserId) ||
                (p.user && p.user.id.toString() === currentUserId)),
          )

          return {
            participants: updatedRoom.participants,
            isJoined: isCurrentUserJoined,
          }
        })
      }
    })

    // 방 입장이 필요하면 개선된 joinRoom 함수 사용
    if (room?.id) {
      socketService.joinRoom(room.id)
      console.log('방 입장 요청:', room.id)

      // 방 입장 완료 후 초기 상태 갱신을 위한 참여자 정보 요청
      setTimeout(() => {
        socketService.emit('getParticipants', { roomId: room.id })
      }, 500)
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      socketService.off('connect')
      socketService.off('disconnect')
      socketService.off('connect_error')
      socketService.off('participantsUpdated')
      socketService.off('roomUpdated')
      console.log('방 정보 이벤트 리스너 제거 완료')
    }
  }, [room?.id, currentUserId]) // room.id와 currentUserId가 변경될 때 갱신

  // 방 입장 시 한 번만 자동 참여 처리 - 중복 참여 방지 기능 추가
  useEffect(() => {
    // 방 ID가 없거나 사용자 ID가 없으면 실행하지 않음
    if (!room?.id || !currentUserId) return

    // 이미 이 화면에서 참여 처리를 했다면 스킵
    if (localRoomState.isJoined) {
      console.log('이미 참여 처리됨 - 중복 요청 방지')
      return
    }

    // 참여 여부 확인 및 참여 처리 함수
    const checkAndJoinRoom = async () => {
      console.log('방 참여 여부 확인 및 참여 처리 시작')

      // 1. 방 참여자 목록에 현재 사용자가 있는지 확인 (ID 형식 모두 고려)
      if (room.participants && Array.isArray(room.participants)) {
        const isInParticipantList = room.participants.some(
          (p) =>
            p &&
            (p.id === currentUserId ||
              (p.userId && p.userId.toString() === currentUserId) ||
              (p.user && p.user.id && p.user.id.toString() === currentUserId)),
        )

        if (isInParticipantList) {
          console.log('참여자 목록에서 현재 사용자 발견 - 이미 참여중')
          setLocalRoomState((prev) => ({ ...prev, isJoined: true }))

          // 로컬 스토리지에도 저장
          try {
            const joinedRoomsStr = localStorage.getItem('joinedRooms')
            const joinedRooms = joinedRoomsStr ? JSON.parse(joinedRoomsStr) : []
            if (!joinedRooms.includes(room.id)) {
              localStorage.setItem(
                'joinedRooms',
                JSON.stringify([...joinedRooms, room.id]),
              )
            }
          } catch (e) {
            console.error('저장소 업데이트 오류:', e)
          }
          return
        }
      }

      // 2. 로컬 스토리지에서 이미 참여한 방 ID 확인
      try {
        const joinedRoomsStr = localStorage.getItem('joinedRooms')
        const joinedRooms = joinedRoomsStr ? JSON.parse(joinedRoomsStr) : []

        if (joinedRooms.includes(room.id)) {
          console.log('로컬 스토리지에 이미 참여한 방으로 기록되어 있음')
          setLocalRoomState((prev) => ({ ...prev, isJoined: true }))
          return
        }
      } catch (e) {
        console.error('저장된 참여방 정보 가져오기 오류:', e)
      }

      // 3. 위 두 조건 모두 해당되지 않으면 API를 통해 방 참여 시도
      console.log('API를 통한 방 참여 시도:', room.id)

      try {
        // API를 통해 방 참여 요청
        const joined = await deliveryRoomApi.joinRoom(room.id)

        if (joined) {
          console.log('방 참여 성공!')

          // 참여 상태 업데이트
          setLocalRoomState((prev) => ({
            ...prev,
            isJoined: true,
          }))

          // 성공적으로 참여한 방 ID를 로컬 스토리지에 저장
          try {
            const joinedRoomsStr = localStorage.getItem('joinedRooms')
            const joinedRooms = joinedRoomsStr ? JSON.parse(joinedRoomsStr) : []
            if (!joinedRooms.includes(room.id)) {
              localStorage.setItem(
                'joinedRooms',
                JSON.stringify([...joinedRooms, room.id]),
              )
            }
          } catch (e) {
            console.error('로컬 스토리지 저장 오류:', e)
          }
        } else {
          console.log('방 참여 실패 - 상태 갱신 실패')
        }
      } catch (error) {
        console.error('자동 참여 오류:', error)
      }
    }

    // 참여 여부 확인 및 참여 처리 함수 호출
    checkAndJoinRoom()
  }, [room?.id, currentUserId, localRoomState.isJoined])

  // room객체가 undefined일 경우 대비
  if (!room || !room.participants) {
    return (
      <Container>
        <HeaderContainer>
          <BackButton onClick={onBack}>
            <span>←</span> 뒤로
          </BackButton>
          <HeaderTitle>방 정보를 불러올 수 없습니다</HeaderTitle>
        </HeaderContainer>
      </Container>
    )
  }

  // 사용자 ID 중 undefined값이 있을 경우 오류 방지
  // 로컬 상태에서 참여자 정보 찾기
  const currentUserParticipant = localRoomState.participants.find(
    (p) => p && p.id && p.id === currentUserId,
  )
  const isUserInRoom = localRoomState.isJoined
  const deliveryFeePerPerson =
    (room.deliveryFee || 0) / (localRoomState.participants.length || 1)

  const handleLeaveRoom = () => {
    if (showLeaveModal) {
      onLeaveRoom()
      setShowLeaveModal(false)
    } else {
      setShowLeaveModal(true)
    }
  }

  const renderHeader = () => {
    return (
      <HeaderContainer>
        <BackButton onClick={onBack}>
          <span>←</span> 뒤로
        </BackButton>
        <HeaderTitle>{room?.restaurantName || '식당명 없음'}</HeaderTitle>
        <HeaderActions>
          {isUserInRoom && (
            <LeaveButton onClick={() => setShowLeaveModal(true)}>
              나가기
            </LeaveButton>
          )}
        </HeaderActions>
      </HeaderContainer>
    )
  }

  const renderRoomInfo = () => {
    const categoryName =
      FOOD_CATEGORIES.find((c) => c.id === room?.categoryId)?.name || '기타'

    return (
      <InfoSection>
        <InfoHeader>주문 정보</InfoHeader>
        <InfoRow>
          <InfoLabel>음식 카테고리</InfoLabel>
          <InfoValue>{categoryName}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>최소 주문 금액</InfoLabel>
          <InfoValue>
            {(room?.minOrderAmount || 0).toLocaleString()}원
          </InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>배달비</InfoLabel>
          <InfoValue>
            {(room?.deliveryFee || 0).toLocaleString()}원 (1인당 약{' '}
            {Math.ceil(deliveryFeePerPerson).toLocaleString()}원)
          </InfoValue>
        </InfoRow>
      </InfoSection>
    )
  }
  
  // 공동주문 링크 섹션 렌더링
  const renderOrderLinks = () => {
    return (
      <InfoSection>
        <InfoHeader>공동주문 링크</InfoHeader>
        <div
          style={{
            color: '#444',
            fontSize: '15px',
            padding: '12px 0',
            lineHeight: '1.5',
          }}
        >
          {room.description ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap'
              }}
            >
              <a
                href={room.description}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#26a69a',
                  textDecoration: 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 500,
                  flex: 1,
                  minWidth: '200px'
                }}
              >
                {room.description}
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(room.description || '')
                  alert('링크가 복사되었습니다!')
                }}
                style={{
                  backgroundColor: '#e0f2f1',
                  color: '#00695c',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                복사
              </button>
            </div>
          ) : (
            '등록된 공동주문 링크가 없습니다'
          )}
        </div>
      </InfoSection>
    )
  }

  // 참여자 데이터 처리 로직
  useEffect(() => {
    const participants = localRoomState.participants

    // 참여자 데이터 처리는 그대로 유지 (디버깅 로그)
    if (participants && Array.isArray(participants)) {
      console.log(`참여자 데이터 처리: ${participants.length}명`)

      // 사용자 이름 매핑 확인
      participants.forEach((p) => {
        if (p && p.user && p.user.nickname) {
          // 새 구조: user 객체 내부에 nickname이 있는 경우
          console.log(`참여자 ID: ${p.id}, 이름: ${p.user.nickname}`)
        } else if (p && p.name) {
          // 이전 구조: participant에 직접 name이 있는 경우
          console.log(`참여자 ID: ${p.id}, 이름: ${p.name}`)
        }
      })
    }
  }, [localRoomState.participants])

  // 방 상태 변경시 로컬 상태 업데이트
  useEffect(() => {
    if (room && room.participants) {
      // 방 정보가 변경되면 참여자 정보 상세 로깅
      console.log('방 정보 변경 -> 참여자 정보:', room.participants)

      // 참여자 정보가 유효한지 확인
      const validParticipants = room.participants.filter(
        (p) => p && (p.id || (p.user && p.user.id)),
      )
      if (validParticipants.length !== room.participants.length) {
        console.warn('일부 유효하지 않은 참여자 정보가 제외됨')
      }

      setLocalRoomState((prev) => ({
        ...prev,
        participants: validParticipants,
        isJoined: validParticipants.some((p) => p.id === currentUserId),
      }))
    }
  }, [room, currentUserId])

  const renderOrderSection = () => {
    return (
      <OrderSection>
        <SectionTitle>내 주문 정보</SectionTitle>
        <OrderInputGroup>
          <OrderInputLabel>주문 메뉴</OrderInputLabel>
          <OrderInputField
            value={menuItems}
            onChange={(e) => setMenuItems(e.target.value)}
            placeholder="주문할 메뉴를 입력하세요 (예: 양념 치킨 1, 콜라 1)"
          />
        </OrderInputGroup>
        <OrderInputGroup>
          <OrderInputLabel>주문 금액</OrderInputLabel>
          <OrderInputField
            type="number"
            value={orderAmount || ''}
            onChange={(e) => setOrderAmount(Number(e.target.value))}
            placeholder="0"
          />
          <InputAddon>원</InputAddon>
        </OrderInputGroup>
        <OrderSummary>
          <SummaryItem>
            <SummaryLabel>메뉴 가격</SummaryLabel>
            <SummaryValue>{orderAmount.toLocaleString()}원</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>배달비</SummaryLabel>
            <SummaryValue>
              +{Math.ceil(deliveryFeePerPerson).toLocaleString()}원
            </SummaryValue>
          </SummaryItem>
          <SummaryTotal>
            <SummaryLabel>총 주문 예상 금액</SummaryLabel>
            <TotalValue>
              {(orderAmount + Math.ceil(deliveryFeePerPerson)).toLocaleString()}
              원
            </TotalValue>
          </SummaryTotal>
        </OrderSummary>
      </OrderSection>
    )
  }

  // 모든 참여자가 편집 가능하도록 변경
  const isUserInTheRoom = Boolean(localRoomState.isJoined)
  
  // 디버깅을 위한 콘솔 로그
  useEffect(() => {
    console.log('[디버깅] 사용자 방 참여 상태:', isUserInTheRoom)
  }, [isUserInTheRoom])

  return (
    <Container>
      {renderHeader()}
      <MainContent>
        <LeftColumn>
          {renderRoomInfo()}
          {renderOrderLinks()}
          {isUserInRoom && renderOrderSection()}
        </LeftColumn>
        <RightColumn>
          <ChatRoom
            roomId={room.id}
            participants={localRoomState.participants}
            currentUserId={currentUserId}
            onClose={onBack}
          />
        </RightColumn>
      </MainContent>
      {showLeaveModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>주문방 나가기</ModalTitle>
            <ModalMessage>
              정말로 이 주문방을 나가시겠습니까? 나가시면 입력하신 주문 정보가
              사라집니다.
            </ModalMessage>
            <ModalActions>
              <ConfirmButton onClick={handleLeaveRoom}>나가기</ConfirmButton>
              <CancelButton onClick={() => setShowLeaveModal(false)}>
                취소
              </CancelButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}

export default RoomDetail

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f5f5;
`

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  background-color: #26a69a;
  border-bottom: 1px solid #b2dfdb;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;

  span {
    margin-right: 6px;
    font-size: 18px;
  }

  &:hover {
    transform: translateX(-3px);
    opacity: 0.9;
  }
`

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`

const HeaderActions = styled.div`
  display: flex;
`

const LeaveButton = styled.button`
  background: none;
  border: 1px solid white;
  color: white;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2열 그리드 레이아웃 */
  gap: 20px;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #26a69a;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* 모바일에서는 단일 열로 변경 */
  }
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoSection = styled.section`
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 183, 170, 0.1);
  padding: 18px;
  border: 1px solid #e0f2f1;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 183, 170, 0.15);
    transform: translateY(-2px);
  }
`

const InfoHeader = styled.h2`
  margin: 0 0 16px 0;
  font-size: 17px;
  font-weight: 600;
  color: #00897b;
  position: relative;
  padding-bottom: 8px;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: #26a69a;
    border-radius: 3px;
  }
`

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0f2f1;
  transition: all 0.2s ease;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  &:hover {
    background-color: #f9fffd;
  }
`

const InfoLabel = styled.div`
  flex: 0 0 120px;
  font-weight: 500;
  color: #3e8e41;
  font-size: 15px;
`

const InfoValue = styled.div`
  flex: 1;
  color: #424242;
  font-size: 15px;
  line-height: 1.4;
`

const ParticipantsSection = styled.section`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
`

const SectionTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #3e8e41;
`

const ParticipantsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const ParticipantItem = styled.div<{ $isCurrentUser?: boolean }>`
  display: flex;
  gap: 6px;
  padding: 6px 12px;
  background-color: ${(props) =>
    props.$isCurrentUser ? '#e0f2f1' : '#f5f5f5'};
  border-radius: 16px;
  border: ${(props) => (props.$isCurrentUser ? '1px solid #26a69a' : 'none')};
  font-size: 13px;
`

const UserAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #26a69a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
`

const ParticipantName = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #424242;
`

const HostBadge = styled.span`
  font-size: 11px;
  padding: 2px 6px;
  background-color: #e0f2f1;
  color: #00897b;
  border-radius: 4px;
  font-weight: 600;
`

const JoinSection = styled.section`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
  text-align: center;
`

const JoinMessage = styled.p`
  margin: 0 0 16px 0;
  color: #424242;
`

const JoinButton = styled.button`
  background-color: #8bc34a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #00897b;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`

const OrderSection = styled(InfoSection)`
  margin-top: 16px;
  background-color: #f7f7f7;
`

const OrderInputGroup = styled.div`
  margin-bottom: 16px;
  position: relative;
`

const OrderInputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #3e8e41;
`

const OrderInputField = styled.input`
  padding: 12px 14px;
  border: 1px solid #8bc34a;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #26a69a;
    box-shadow: 0 0 0 2px rgba(0, 150, 136, 0.2);
  }

  &::placeholder {
    color: #b0bec5;
  }
`

const InputAddon = styled.div`
  position: absolute;
  right: 16px;
  top: 40px;
  color: #424242;
`

const OrderSummary = styled.div`
  background-color: #e0f2f1;
  padding: 18px;
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0 2px 6px rgba(0, 150, 136, 0.1);
  border: 1px solid #8bc34a;
`

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 15px;
  padding: 4px 0;
`

const SummaryLabel = styled.div`
  color: #3e8e41;
  font-weight: 500;
`

const SummaryValue = styled.div`
  color: #424242;
  font-weight: 500;
`

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #b2dfdb;
  font-size: 16px;
  font-weight: 600;
`

const TotalValue = styled.div`
  color: #3e8e41;
  font-size: 18px;
  font-weight: 700;
`

const ChatSection = styled.section`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
  flex: 1;
  max-height: 500px;
  display: flex;
  flex-direction: column;
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`

const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #3e8e41;
`

const ModalMessage = styled.p`
  margin: 0 0 24px 0;
  color: #424242;
  line-height: 1.5;
`

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
`

const ConfirmButton = styled.button`
  flex: 1;
  padding: 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #c92a2a;
  }
`

const CancelButton = styled.button`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  background-color: white;
  color: #444;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }
`
