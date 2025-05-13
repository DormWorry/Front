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
    id: userRecoil && userRecoil.id ? String(userRecoil.id) : '0', // 기본값을 빈 문자열 대신 '0'으로 설정
    name: userRecoil && userRecoil.nickname ? userRecoil.nickname : '익명',
    avatar: userRecoil && userRecoil.profileImage ? userRecoil.profileImage : undefined,
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

    // 소켓 연결 (사용자 정보 전달 없이)
    console.log('소켓 연결 시도...');
    const socket = socketService.connect();
    console.log('소켓 연결 결과:', socket ? '성공' : '실패');
    
    // 방 목록 업데이트 이벤트 리스너
    socketService.on('roomsUpdated', (updatedRooms) => {
      console.log('방 목록 업데이트 받음:', updatedRooms?.length);
      setOrderRooms(updatedRooms);
    });

    // 초기 데이터 로드
    loadRooms();

    // 컴포넌트 언마운트 시 정리
    return () => {
      socketService.off('roomsUpdated');
    };
  }, [])

  // 이전 방식은 사용하지 않음 (deprecated)
  // joinedRoomId 변경 시 방 참여 처리 - 새로운 방식으로 교체
  useEffect(() => {
    // 이전 방식 기능 비활성화
    // if (joinedRoomId) {
    //   handleJoinRoomEffect()
    // }
  }, [joinedRoomId])

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
      
      try {
        // REST API를 통해 방 생성
        const newRoom = await deliveryRoomApi.createRoom(apiRoomData);
        if (newRoom) {
          // 성공적으로 방이 생성되면 방 목록 새로고침
          const rooms = await deliveryRoomApi.getRooms();
          setOrderRooms(rooms);
          setShowCreateRoomModal(false);
          
          // 생성된 방에 자동 참여
          if (newRoom.id) {
            setJoinedRoomId(newRoom.id);
          }
        }
      } catch (error) {
        console.error('방 생성 실패:', error);
      }
    } catch (error) {
      console.error('방 생성 중 오류 발생:', error);
    }
  }

  // 방 참여 핸들러 - 로그 강화 및 새로고침 방지 개선 버전
  const handleJoinRoom = async (roomId: string) => {
    try {
      // 클릭한 방 ID와 현재 선택된 방 비교
      console.log('[방 참여 시도]', { roomId, currentSelectedRoomId: selectedRoom?.id });
      
      // 이미 선택된 방인 경우 중복 처리 방지
      if (selectedRoom?.id === roomId) {
        console.log('[이미 참여 중인 방] 중복 참여 요청 무시');
        return; // 이미 같은 방에 참여 중이면 아무것도 하지 않음
      }
      
      // 방 정보 조회 - 서버 요청 최소화를 위해 클라이언트 캐시 활용
      const existingRoom = orderRooms.find(r => r.id === roomId);
      let roomDetails;
      
      if (existingRoom) {
        // 이미 목록에 있는 방이면 캐시된 정보 사용
        console.log('[캐시된 방 정보 사용]');
        roomDetails = existingRoom;
      } else {
        // 방 정보가 없으면 서버에서 조회
        console.log('[서버에서 방 정보 조회]');
        roomDetails = await deliveryRoomApi.getRoom(roomId);
      }
      
      if (!roomDetails) {
        console.error('[방 정보 조회 실패] API 응답 없음');
        return;
      }
      
      // 방에 참여하는 로직 - 오류 처리 강화
      try {
        // 참여 API 호출 - 비동기 실행
        console.log('[방 참여 API 호출 시작]');
        await deliveryRoomApi.joinRoom(roomId);
        console.log('[방 참여 API 호출 성공]');
      } catch (joinError: any) {
        // 이미 참여한 경우(409) 등의 오류는 무시
        console.log('[참여 API 호출 결과]', { 
          status: joinError?.response?.status,
          message: joinError?.message
        });
        
        // 409가 아닌 다른 오류면 사용자에게 알림
        if (joinError?.response?.status !== 409) {
          console.error('[참여 중 오류 발생]', joinError);
        }
      }
      
      // 소켓 연결 설정 - 예외 처리 강화
      try {
        console.log('[소켓 룸 조인 시작]', roomId);
        // 소켓 이벤트를 미리 초기화하여 중복 이벤트 방지
        socketService.off('participantsUpdated');
        socketService.off('newMessage');
        
        // 방 참여 이벤트 전송
        socketService.emit('joinRoom', { deliveryRoomId: roomId });
        console.log('[소켓 룸 조인 요청 완료]');
      } catch (socketError) {
        console.error('[소켓 연결 오류]', socketError);
        // 소켓 오류가 발생해도 UI는 정상적으로 업데이트
      }
      
      // 소켓 이벤트 리스너 설정 - 추가 예외 처리
      try {
        // 참여자 업데이트 이벤트
        socketService.on('participantsUpdated', (participants: ParticipantType[]) => {
          console.log('[참여자 업데이트 이벤트]', {
            count: participants?.length,
            currentRoomId: selectedRoom?.id,
            receivedForRoomId: roomId
          });
          
          // 현재 선택된 방의 참여자 정보 업데이트
          if (selectedRoom && selectedRoom.id === roomId) {
            setSelectedRoom(prev => prev ? {...prev, participants} : null);
          }
        });
        
        // 새 메시지 이벤트
        socketService.on('newMessage', (message: MessageType) => {
          console.log('[새 메시지 이벤트]', message);
          // 추가 메시지 처리 로직은 필요시 구현
        });
        
        console.log('[소켓 이벤트 리스너 설정 완료]');
      } catch (listenerError) {
        console.error('[이벤트 리스너 설정 오류]', listenerError);
      }

      // 상태 업데이트 - 방 정보 설정
      console.log('[방 상태 업데이트]', roomDetails?.name);
      setSelectedRoom(roomDetails);
    } catch (error) {
      console.error('방 참여 처리 중 오류:', error);
    }
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
