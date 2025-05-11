import { useState, useEffect, useCallback } from 'react'
import deliveryRoomApi, { DeliveryRoom } from '../../api/deliveryRoomApi'
import { DeliveryRoomStatus } from '../../types/delivery'
import deliveryParticipantApi, {
  CreateDeliveryParticipantDto,
} from '../../api/deliveryParticipantApi'
import { DeliveryParticipant } from '../../types/delivery'

interface UseDeliveryRoomDetailProps {
  roomId: string
  autoFetch?: boolean
}

interface UseDeliveryRoomDetailResult {
  room: DeliveryRoom | null
  participants: DeliveryParticipant[]
  loading: boolean
  error: Error | null
  fetchRoom: () => Promise<void>
  joinRoom: (
    data: Omit<CreateDeliveryParticipantDto, 'deliveryRoomId'>,
  ) => Promise<void>
  updateRoomStatus: (status: string) => Promise<void>
  togglePaymentStatus: (participantId: string) => Promise<void>
  leaveRoom: (participantId: string) => Promise<void>
}

export const useDeliveryRoomDetail = ({
  roomId,
  autoFetch = true,
}: UseDeliveryRoomDetailProps): UseDeliveryRoomDetailResult => {
  const [room, setRoom] = useState<DeliveryRoom | null>(null)
  const [participants, setParticipants] = useState<DeliveryParticipant[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchRoom = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // 방 정보 조회
      const roomData = await deliveryRoomApi.getRoomById(roomId)
      setRoom(roomData)

      // 참가자 목록 조회
      const participantsData =
        await deliveryParticipantApi.getParticipantsByRoomId(roomId)
      setParticipants(participantsData)
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('알 수 없는 오류가 발생했습니다'),
      )
      console.error('배달방 상세 정보 조회 중 오류 발생:', err)
    } finally {
      setLoading(false)
    }
  }, [roomId])

  // 배달 방 참가
  const joinRoom = useCallback(
    async (data: Omit<CreateDeliveryParticipantDto, 'deliveryRoomId'>) => {
      try {
        const joinData: CreateDeliveryParticipantDto = {
          ...data,
          deliveryRoomId: roomId,
        }
        await deliveryParticipantApi.joinRoom(joinData)
        // 참가 후 정보 다시 조회
        await fetchRoom()
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('배달방 참가 중 오류가 발생했습니다'),
        )
        console.error('배달방 참가 중 오류 발생:', err)
        throw err
      }
    },
    [roomId, fetchRoom],
  )

  // 배달 방 상태 변경
  const updateRoomStatus = useCallback(
    async (status: string) => {
      try {
        await deliveryRoomApi.updateRoomStatus(roomId, status as DeliveryRoomStatus)
        await fetchRoom()
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('배달방 상태 변경 중 오류가 발생했습니다'),
        )
        console.error('배달방 상태 변경 중 오류 발생:', err)
        throw err
      }
    },
    [roomId, fetchRoom],
  )

  // 결제 상태 토글
  const togglePaymentStatus = useCallback(
    async (participantId: string) => {
      try {
        await deliveryParticipantApi.togglePaymentStatus(participantId)
        // 참가자 정보 다시 조회
        const participantsData =
          await deliveryParticipantApi.getParticipantsByRoomId(roomId)
        setParticipants(participantsData)
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('결제 상태 변경 중 오류가 발생했습니다'),
        )
        console.error('결제 상태 변경 중 오류 발생:', err)
        throw err
      }
    },
    [roomId],
  )

  // 배달 방 나가기
  const leaveRoom = useCallback(
    async (participantId: string) => {
      try {
        await deliveryParticipantApi.leaveRoom(participantId)
        // 참가자 정보 다시 조회
        await fetchRoom()
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('배달방 나가기 중 오류가 발생했습니다'),
        )
        console.error('배달방 나가기 중 오류 발생:', err)
        throw err
      }
    },
    [fetchRoom],
  )

  useEffect(() => {
    if (autoFetch && roomId) {
      fetchRoom()
    }
  }, [autoFetch, fetchRoom, roomId])

  return {
    room,
    participants,
    loading,
    error,
    fetchRoom,
    joinRoom,
    updateRoomStatus,
    togglePaymentStatus,
    leaveRoom,
  }
}
