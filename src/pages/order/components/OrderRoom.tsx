import React from 'react'
import styled from 'styled-components'
import { OrderRoomType } from '../order-types'
import { getCategoryEmoji, formatTime } from '../../../utils/orderUtils'

interface OrderRoomProps {
  room: OrderRoomType
  onJoinRoom: (roomId: string) => void
}

const OrderRoom: React.FC<OrderRoomProps> = ({ room, onJoinRoom }) => {
  // room이 undefined일 경우 대비
  if (!room) {
    return <RoomContainer>룸 정보를 불러올 수 없습니다.</RoomContainer>
  }
  
  const deliveryFeePerPerson =
    (room?.deliveryFee || 0) / ((room?.participants?.length) || 1)
  const maxDisplayParticipants = 3

  const renderCategoryTag = () => {
    return <CategoryTag>{getCategoryEmoji(room?.categoryId || '')}</CategoryTag>
  }

  const renderRoomHeader = () => {
    return (
      <RoomHeader>
        {renderCategoryTag()}
        <RestaurantName>{room?.restaurantName || '식당명 없음'}</RestaurantName>
      </RoomHeader>
    )
  }

  const renderRoomInfo = () => {
    return (
      <RoomInfo>
        <InfoItem>
          <InfoLabel>최소 주문 금액</InfoLabel>
          <InfoValue>{(room?.minOrderAmount || 0).toLocaleString()}원</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>인당 배달비</InfoLabel>
          <InfoValue>
            {Math.ceil(deliveryFeePerPerson).toLocaleString()}원
          </InfoValue>
        </InfoItem>
      </RoomInfo>
    )
  }

  const renderParticipants = () => {
    if (!room?.participants || !Array.isArray(room.participants)) {
      return <ParticipantsList>참여자 정보를 불러올 수 없습니다.</ParticipantsList>
    }
    
    const displayedParticipants = room.participants.slice(
      0,
      maxDisplayParticipants
    )
    const remainingCount = room.participants.length - maxDisplayParticipants

    return (
      <ParticipantsContainer>
        <ParticipantsLabel>참여자</ParticipantsLabel>
        <ParticipantsList>
          {displayedParticipants.map((participant) => (
            <ParticipantAvatar key={participant.id}>
              {participant.name.charAt(0).toUpperCase()}
            </ParticipantAvatar>
          ))}
          {remainingCount > 0 && (
            <RemainingParticipants>+{remainingCount}</RemainingParticipants>
          )}
        </ParticipantsList>
      </ParticipantsContainer>
    )
  }

  const renderDescription = () => {
    return (
      <DescriptionContainer>
        {room?.description ? (
          <Description>{room.description}</Description>
        ) : (
          <EmptyDescription>추가 설명 없음</EmptyDescription>
        )}
      </DescriptionContainer>
    )
  }

  const renderFooter = () => {
    return (
      <RoomFooter>
        <TimeInfo>
          <TimeIcon>⏱️</TimeIcon>
          <TimeText>{formatTime(room?.createdAt || new Date().toISOString())}</TimeText>
        </TimeInfo>
        <JoinButton 
          type="button" /* 버튼 타입을 명시적으로 button으로 지정하여 form 서밋 방지 */
          onClick={(e) => {
            // 가장 기본적인 이벤트 동작만 차단
            e.preventDefault();
            e.stopPropagation();
            
            console.log('[JoinButton] 간소화된 참여하기 버튼 클릭 처리');
            
            // 이벤트 흐름과 분리하여 처리
            setTimeout(() => {
              if (room?.id) {
                console.log('[JoinButton] 안전한 방 참여 호출');
                onJoinRoom(room.id);
              }
            }, 0);
            
            return false;
          }}
        >
          참여하기
        </JoinButton>
      </RoomFooter>
    )
  }

  // 클릭 핸들러 간소화
  const handleJoinClick = (e: React.MouseEvent) => {
    // 기본 이벤트 처리 만 적용
    e.preventDefault();
    e.stopPropagation();
    
    console.log('[전체 방 클릭] 단순화된 처리');
    
    // 단순 타임아웃 처리
    setTimeout(() => {
      if (room?.id) {
        console.log('[방 전체 클릭] 참여 호출', room.id);
        onJoinRoom(room.id);
      }
    }, 0);
    
    return false;
  };
  
  return (
    <RoomContainer 
      role="button" /* 접근성을 위해 role 지정 */
      onClick={handleJoinClick}
    >
      {renderRoomHeader()}
      {renderRoomInfo()}
      {renderParticipants()}
      {renderDescription()}
      {renderFooter()}
    </RoomContainer>
  )
}

// 다른 컴포넌트와 형식은 그대로 유지하면서 속성 추가
const RoomContainer = styled.div`
  width: 100%;
  border: none;
  text-align: left;
  padding: 0;
  background: none;
  position: relative; /* 포지션 추가 */
  z-index: 1; /* 레이어 순서 보장 */
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`

const RoomHeader = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #f0f0f0;
`

const CategoryTag = styled.div`
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: #f3f4f6;
  flex-shrink: 0;
`

const RestaurantName = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #444;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const RoomInfo = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoLabel = styled.span`
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
`

const InfoValue = styled.span`
  font-weight: 600;
  color: #444;
`

const ParticipantsContainer = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`

const ParticipantsLabel = styled.div`
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
`

const ParticipantsList = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ParticipantAvatar = styled.div`
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

const RemainingParticipants = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #f3f4f6;
  color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
`

const DescriptionContainer = styled.div`
  padding: 16px;
  flex: 1;
  min-height: 60px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
`

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  color: #444;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
`

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #aaa;
  font-style: italic;
`

const RoomFooter = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const TimeIcon = styled.span`
  font-size: 14px;
`

const TimeText = styled.span`
  font-size: 12px;
  color: #888;
`

// div에서 button으로 변경하고 type="button"을 명시적으로 지정하여 새로고침 방지
const JoinButton = styled.button`
  background-color: #13cfb8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: inline-block;
  user-select: none;

  &:hover {
    background-color: #10b9a5;
  }
`

export default OrderRoom
