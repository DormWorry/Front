import React, { useCallback } from 'react'
import { FOOD_CATEGORIES } from '../../constants/foodCategories'
import { useOrderState } from '../../hooks/order'
import * as S from './order-styles'
import {
  FoodCategory,
  OrderRoom,
  CreateRoomModal,
  RoomDetail,
} from './components'
import { useRouter } from 'next/router'

export default function OrderFeature() {
  const router = useRouter()
  
  // 기본 동작 방지 함수 - 추후 필요시 사용
  const preventRefresh = useCallback((e: React.MouseEvent<HTMLElement> | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    return false;
  }, []);

  const goToMainPage = () => {
    router.push('/main')
  }

  // 주문 상태 관리 훅 호출
  const {
    selectedCategory,
    showCreateRoomModal,
    selectedRoom,
    currentUser,
    currentPage,
    handleSelectCategory,
    handleCreateRoom,
    handleJoinRoom,
    handleBackFromRoomDetail,
    handleLeaveRoom,
    getFilteredRooms,
    getPaginatedRooms,
    getTotalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    toggleCreateRoomModal,
  } = useOrderState()

  const renderRoomDetail = () => {
    if (!selectedRoom) return null

    return (
      <RoomDetail
        room={selectedRoom}
        currentUserId={currentUser.id}
        onBack={handleBackFromRoomDetail}
        onLeaveRoom={handleLeaveRoom}
      />
    )
  }

  const renderCategorySection = () => {
    return (
      <S.CategorySection>
        <S.SectionHeaderRow>
          <S.SectionTitle>음식 카테고리</S.SectionTitle>
        </S.SectionHeaderRow>
        <FoodCategory
          categories={FOOD_CATEGORIES}
          onSelectCategory={handleSelectCategory}
          selectedCategory={selectedCategory}
        />
      </S.CategorySection>
    )
  }

  const renderRoomsSection = () => {
    const filteredRooms = getFilteredRooms()
    const paginatedRooms = getPaginatedRooms()
    const totalPages = getTotalPages()

    // 페이지 서밋 방지 핸들러
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
      }
      return false;
    };

    const categoryName = selectedCategory
      ? FOOD_CATEGORIES.find((c) => c.id === selectedCategory)?.name
      : null

    return (
      <S.RoomsSection>
        <S.SectionHeaderRow>
          <S.SectionTitle>
            {categoryName
              ? `${categoryName} 주문방 (${filteredRooms.length})`
              : `전체 주문방 (${filteredRooms.length})`}
          </S.SectionTitle>
          <S.CreateRoomButton onClick={toggleCreateRoomModal}>
            <S.PlusIcon>+</S.PlusIcon> 주문방 만들기
          </S.CreateRoomButton>
        </S.SectionHeaderRow>

        {filteredRooms.length === 0 ? (
          <S.EmptyState>
            <S.EmptyMessage>
              {selectedCategory
                ? '해당 카테고리의 주문방이 없습니다. 첫 번째 방을 만들어보세요!'
                : '아직 주문방이 없습니다. 첫 번째 방을 만들어보세요!'}
            </S.EmptyMessage>
            <S.CreateRoomButton onClick={toggleCreateRoomModal}>
              <S.PlusIcon>+</S.PlusIcon> 주문방 만들기
            </S.CreateRoomButton>
          </S.EmptyState>
        ) : (
          <>
            <S.RoomsList>
              {paginatedRooms.map((room) => (
                <OrderRoom
                  key={room.id}
                  room={room}
                  onJoinRoom={(roomId) => {
                    // 상위 컴포넌트에서 추가 보호 조치
                    console.log('[index.tsx] 방 참여 버튼 클릭 - 새로고침 방지');
                    // 비동기 처리로 이벤트 흐름 보호
                    setTimeout(() => {
                      handleJoinRoom(roomId);
                    }, 0);
                    return false;
                  }}
                />
              ))}
            </S.RoomsList>

            {/* 페이지네이션 UI */}
            {totalPages > 1 && (
              <S.PaginationContainer>
                <S.PageNavButton
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <S.PageButtonText>이전</S.PageButtonText>
                </S.PageNavButton>

                {Array.from({ length: totalPages }).map((_, index) => (
                  <S.PageButton
                    key={index + 1}
                    isActive={currentPage === index + 1}
                    onClick={() => goToPage(index + 1)}
                  >
                    {index + 1}
                  </S.PageButton>
                ))}

                <S.PageNavButton
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <S.PageButtonText>다음</S.PageButtonText>
                </S.PageNavButton>
              </S.PaginationContainer>
            )}
          </>
        )}
      </S.RoomsSection>
    )
  }

  const renderCreateRoomModal = () => {
    if (!showCreateRoomModal) return null

    return (
      <CreateRoomModal
        categories={FOOD_CATEGORIES}
        onCreateRoom={handleCreateRoom}
        onClose={toggleCreateRoomModal}
      />
    )
  }

  return (
    <S.Container>
      {selectedRoom ? (
        renderRoomDetail()
      ) : (
        <>
          <S.MainHeader>
            <S.BackButton onClick={goToMainPage}>←</S.BackButton>
            <S.PageTitle>주문하기</S.PageTitle>
            <S.HeaderDescription>
              기숙사 친구들과 함께 배달음식을 주문하세요!
            </S.HeaderDescription>
          </S.MainHeader>
          {renderCategorySection()}
          {renderRoomsSection()}
          {renderCreateRoomModal()}
        </>
      )}
    </S.Container>
  )
}
