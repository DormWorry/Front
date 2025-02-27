import { useState, useEffect, useCallback } from 'react'
import { OrderRoomType, ParticipantType } from '../../pages/order/order-types'
import { getMockRooms } from '../../api/mockData'

/**
 * 주문 기능의 상태 관리를 위한 커스텀 훅
 */
export const useOrderState = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)
  const [orderRooms, setOrderRooms] = useState<OrderRoomType[]>([])
  const [selectedRoom, setSelectedRoom] = useState<OrderRoomType | null>(null)
  const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6) // 기본값은 PC 기준 6개

  const currentUser: ParticipantType = {
    id: 'user-1',
    name: '권도훈',
  }

  // 반응형 아이템 수 조정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(2); // 모바일에서는 2개
      } else {
        setItemsPerPage(6); // PC에서는 6개
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 로딩 시 실행

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    setOrderRooms(getMockRooms())
  }, [])

  // 방 참여 처리를 위한 effect
  useEffect(() => {
    if (joinedRoomId && selectedRoom) {
      handleJoinRoomEffect()
    }
  }, [joinedRoomId, orderRooms, selectedRoom])

  const handleJoinRoomEffect = () => {
    const roomToJoin = orderRooms.find((room) => room.id === joinedRoomId)

    if (roomToJoin) {
      const isUserInRoom = roomToJoin.participants.some(
        (p) => p.id === currentUser.id,
      )

      if (!isUserInRoom) {
        const updatedRoom = {
          ...roomToJoin,
          participants: [...roomToJoin.participants, currentUser],
        }

        const updatedRooms = orderRooms.map((room) =>
          room.id === updatedRoom.id ? updatedRoom : room,
        )

        setOrderRooms(updatedRooms)
        setSelectedRoom(updatedRoom)
      }

      setJoinedRoomId(null)
    }
  }

  // 카테고리 선택 핸들러
  const handleSelectCategory = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(categoryId)
    }
    // 카테고리 변경 시 페이지 리셋
    setCurrentPage(1)
  }

  // 방 생성 핸들러
  const handleCreateRoom = (roomData: {
    restaurantName: string
    minOrderAmount: number
    deliveryFee: number
    categoryId: string
    description?: string
  }) => {
    const newRoom: OrderRoomType = {
      id: `room-${Date.now()}`,
      ...roomData,
      participants: [currentUser],
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
    }

    setOrderRooms([newRoom, ...orderRooms])
    setShowCreateRoomModal(false)
  }

  // 방 참여 핸들러
  const handleJoinRoom = (roomId: string) => {
    const room = orderRooms.find((r) => r.id === roomId)
    if (room) {
      setSelectedRoom(room)
      setJoinedRoomId(roomId)
    }
  }

  // 방 상세화면에서 뒤로가기 핸들러
  const handleBackFromRoomDetail = () => {
    setSelectedRoom(null)
  }

  // 방 나가기 핸들러
  const handleLeaveRoom = () => {
    if (selectedRoom) {
      const updatedRooms = orderRooms.map((room) => {
        if (room.id === selectedRoom.id) {
          return {
            ...room,
            participants: room.participants.filter(
              (p) => p.id !== currentUser.id,
            ),
          }
        }
        return room
      })

      setOrderRooms(updatedRooms)
      setSelectedRoom(null)
    }
  }

  // 선택된 카테고리에 따라 방 필터링
  const getFilteredRooms = () => {
    const filtered = selectedCategory
      ? orderRooms.filter((room) => room.categoryId === selectedCategory)
      : orderRooms

    return filtered
  }

  // 현재 페이지에 해당하는 아이템만 반환
  const getPaginatedRooms = useCallback(() => {
    const filtered = getFilteredRooms();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [orderRooms, selectedCategory, currentPage, itemsPerPage]);

  // 전체 페이지 수 계산
  const getTotalPages = useCallback(() => {
    const filtered = getFilteredRooms();
    return Math.ceil(filtered.length / itemsPerPage);
  }, [orderRooms, selectedCategory, itemsPerPage]);

  // 다음 페이지로 이동
  const goToNextPage = useCallback(() => {
    const totalPages = getTotalPages();
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, getTotalPages]);

  // 이전 페이지로 이동
  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  // 특정 페이지로 이동
  const goToPage = useCallback((page: number) => {
    const totalPages = getTotalPages();
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [getTotalPages]);

  // 모달 표시/숨김 토글
  const toggleCreateRoomModal = () => {
    setShowCreateRoomModal(!showCreateRoomModal)
  }

  // 상태와 관련 함수들 반환
  return {
    selectedCategory,
    showCreateRoomModal,
    selectedRoom,
    orderRooms,
    currentUser,
    currentPage,
    itemsPerPage,
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
  }
}
