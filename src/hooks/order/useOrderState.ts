import { useState, useEffect, useCallback } from 'react'
import { OrderRoomType, ParticipantType, MessageType } from '../../pages/order/order-types'
import deliveryRoomApi from '../../api/deliveryRoom'
import socketService from '../../services/socket.service'
import { useRecoilValue } from 'recoil'
import { userAtom } from '../../atoms/userAtom'

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

  const userRecoil = useRecoilValue(userAtom)
  const currentUser: ParticipantType = {
    id: userRecoil.id ? String(userRecoil.id) : '',
    name: userRecoil.nickname || '익명',
    avatar: userRecoil.profileImage,
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

  // 초기 데이터 로드 및 소켓 설정
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const rooms = await deliveryRoomApi.getRooms();
        setOrderRooms(rooms);
      } catch (error) {
        console.error('방 목록을 불러오는 중 오류 발생:', error);
      }
    };

    // 소켓 연결 (사용자 정보 전달)
    const socket = socketService.connect(userRecoil);
    
    // 방 목록 업데이트 이벤트 리스너
    socketService.on('roomsUpdated', (updatedRooms) => {
      setOrderRooms(updatedRooms);
    });

    // 초기 데이터 로드
    loadRooms();

    // 컴포넌트 언마운트 시 정리
    return () => {
      socketService.off('roomsUpdated');
    };
  }, [])

  // 방 참여 처리를 위한 effect
  useEffect(() => {
    if (joinedRoomId) {
      handleJoinRoomEffect()
    }
  }, [joinedRoomId])

  const handleJoinRoomEffect = async () => {
    if (!joinedRoomId) return;
    
    try {
      // API를 통해 방 참여 요청
      const joined = await deliveryRoomApi.joinRoom(joinedRoomId);
      
      if (joined) {
        // 방 상세 정보 가져오기
        const roomDetails = await deliveryRoomApi.getRoom(joinedRoomId);
        
        if (roomDetails) {
          // 소켓 룸에 조인
          socketService.emit('joinRoom', { deliveryRoomId: joinedRoomId });
          
          // 참여자 업데이트 이벤트 수신 설정
          socketService.on('participantsUpdated', (participants: ParticipantType[]) => {
            if (selectedRoom && selectedRoom.id === joinedRoomId) {
              setSelectedRoom({
                ...selectedRoom,
                participants,
              });
            }
          });
          
          // 메시지 수신 설정
          socketService.on('newMessage', (message: MessageType) => {
            // 메시지 처리 로직은 별도로 구현됨
            console.log('새 메시지:', message);
          });
          
          setSelectedRoom(roomDetails);
        }
      }
      
      setJoinedRoomId(null);
    } catch (error) {
      console.error('방 참여 중 오류 발생:', error);
      setJoinedRoomId(null);
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
  const handleCreateRoom = async (roomData: {
    restaurantName: string
    minOrderAmount: number
    deliveryFee: number
    categoryId: string
    description?: string
  }) => {
    try {
      // API 형식에 맞게 변환
      const apiRoomData = {
        restaurantName: roomData.restaurantName,
        category: roomData.categoryId,
        minimumOrderAmount: roomData.minOrderAmount,
        deliveryFee: roomData.deliveryFee,
        description: roomData.description || '',
      };
      
      // 소켓을 통해 방 생성 요청
      socketService.emit('createRoom', apiRoomData, async (response: any) => {
        if (response.success) {
          // 소켓 응답이 성공적이면 방 목록 새로고침
          const rooms = await deliveryRoomApi.getRooms();
          setOrderRooms(rooms);
          setShowCreateRoomModal(false);
        } else {
          console.error('방 생성 실패:', response.message);
        }
      });
    } catch (error) {
      console.error('방 생성 중 오류 발생:', error);
    }
  }

  // 방 참여 핸들러
  const handleJoinRoom = (roomId: string) => {
    // 참여할 방 ID 설정하면 effect에서 처리
    setJoinedRoomId(roomId);
  }

  // 방 상세화면에서 뒤로가기 핸들러
  const handleBackFromRoomDetail = () => {
    if (selectedRoom) {
      // 소켓 이벤트 청취 중지
      socketService.off('participantsUpdated');
      socketService.off('newMessage');
      
      // 소켓 룸 나가기 (실제 참여자 상태는 유지)
      socketService.emit('leaveRoom', { roomId: selectedRoom.id });
    }
    
    setSelectedRoom(null);
  }

  // 방 나가기 핸들러
  const handleLeaveRoom = async () => {
    if (selectedRoom) {
      try {
        // API를 통해 방 나가기 요청
        const left = await deliveryRoomApi.leaveRoom(selectedRoom.id);
        
        if (left) {
          // 소켓 이벤트 청취 중지
          socketService.off('participantsUpdated');
          socketService.off('newMessage');
          
          // 소켓을 통해 방 나가기 알림
          socketService.emit('leaveRoom', { roomId: selectedRoom.id });
          
          // 방 목록 새로고침
          const updatedRooms = await deliveryRoomApi.getRooms();
          setOrderRooms(updatedRooms);
          setSelectedRoom(null);
        }
      } catch (error) {
        console.error('방 나가기 중 오류 발생:', error);
      }
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
