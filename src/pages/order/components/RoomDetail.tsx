import React, { useState } from 'react'
import styled from 'styled-components'
import { OrderRoomType } from '../order-types'
import ChatRoom from './ChatRoom'
import { FOOD_CATEGORIES } from '../../../constants/foodCategories'

interface RoomDetailProps {
  room: OrderRoomType
  currentUserId: string
  onBack: () => void
  onLeaveRoom: () => void
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

  const currentUserParticipant = room.participants.find(
    (p) => p.id === currentUserId,
  )
  const isUserInRoom = !!currentUserParticipant
  const deliveryFeePerPerson =
    room.deliveryFee / (room.participants.length || 1)

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
        <HeaderTitle>{room.restaurantName}</HeaderTitle>
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
      FOOD_CATEGORIES.find((c) => c.id === room.categoryId)?.name || '기타'

    return (
      <InfoSection>
        <InfoHeader>주문 정보</InfoHeader>
        <InfoRow>
          <InfoLabel>음식 카테고리</InfoLabel>
          <InfoValue>{categoryName}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>최소 주문 금액</InfoLabel>
          <InfoValue>{room.minOrderAmount.toLocaleString()}원</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>배달비</InfoLabel>
          <InfoValue>
            {room.deliveryFee.toLocaleString()}원 (1인당 약{' '}
            {Math.ceil(deliveryFeePerPerson).toLocaleString()}원)
          </InfoValue>
        </InfoRow>
        {room.description && (
          <InfoRow>
            <InfoLabel>설명</InfoLabel>
            <InfoValue>{room.description}</InfoValue>
          </InfoRow>
        )}
      </InfoSection>
    )
  }

  const renderParticipants = () => {
    return (
      <ParticipantsSection>
        <SectionTitle>참여자 ({room.participants.length}명)</SectionTitle>
        <ParticipantsList>
          {room.participants.map((participant) => (
            <ParticipantItem key={participant.id}>
              <UserAvatar>
                {participant.name.charAt(0).toUpperCase()}
              </UserAvatar>
              <ParticipantName>
                {participant.name}
                {participant.id === room.createdBy && (
                  <HostBadge>방장</HostBadge>
                )}
              </ParticipantName>
            </ParticipantItem>
          ))}
        </ParticipantsList>
      </ParticipantsSection>
    )
  }

  const renderOrderSection = () => {
    if (!isUserInRoom) {
      return (
        <JoinSection>
          <JoinMessage>
            이 주문에 참여하시려면 아래 버튼을 클릭하세요.
          </JoinMessage>
          <JoinButton onClick={() => setShowLeaveModal(false)}>
            주문 참여하기
          </JoinButton>
        </JoinSection>
      )
    }

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

  const renderChatSection = () => {
    return (
      <ChatSection>
        <SectionTitle>채팅</SectionTitle>
        <ChatRoom
          roomId={room.id}
          participants={room.participants}
          currentUserId={currentUserId}
          onClose={() => {}}
        />
      </ChatSection>
    )
  }

  const renderLeaveModal = () => {
    if (!showLeaveModal) return null

    return (
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
    )
  }

  return (
    <Container>
      {renderHeader()}
      <MainContent>
        {renderRoomInfo()}
        {renderParticipants()}
        {renderOrderSection()}
        {renderChatSection()}
      </MainContent>
      {renderLeaveModal()}
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
`

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;

  span {
    margin-right: 6px;
    font-size: 18px;
  }
`

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #444;
`

const HeaderActions = styled.div`
  display: flex;
`

const LeaveButton = styled.button`
  background: none;
  border: 1px solid #e03131;
  color: #e03131;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e03131;
    color: white;
  }
`

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const InfoSection = styled.section`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
`

const InfoHeader = styled.h2`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #444;
`

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`

const InfoLabel = styled.div`
  flex: 0 0 120px;
  font-weight: 500;
  color: #444;
`

const InfoValue = styled.div`
  flex: 1;
  color: #444;
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
  color: #444;
`

const ParticipantsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #f8f9fa;
  border-radius: 20px;
`

const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #13cfb8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
`

const ParticipantName = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #444;
`

const HostBadge = styled.span`
  font-size: 11px;
  padding: 2px 6px;
  background-color: #ffe8cc;
  color: #fd7e14;
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
  color: #444;
`

const JoinButton = styled.button`
  background-color: #13cfb8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 15px;
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
`

const OrderSection = styled.section`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
`

const OrderInputGroup = styled.div`
  margin-bottom: 16px;
  position: relative;
`

const OrderInputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #444;
`

const OrderInputField = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
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

const InputAddon = styled.div`
  position: absolute;
  right: 16px;
  top: 40px;
  color: #444;
`

const OrderSummary = styled.div`
  margin-top: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
`

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #eee;
`

const SummaryLabel = styled.div`
  font-size: 14px;
  color: #444;
`

const SummaryValue = styled.div`
  font-size: 14px;
  color: #444;
`

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 8px;
  font-weight: 600;
`

const TotalValue = styled.div`
  color: #13cfb8;
  font-size: 16px;
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
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
  color: #444;
`

const ModalMessage = styled.p`
  margin: 0 0 24px 0;
  color: #444;
  line-height: 1.5;
`

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
`

const ConfirmButton = styled.button`
  flex: 1;
  padding: 12px;
  background-color: #e03131;
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
