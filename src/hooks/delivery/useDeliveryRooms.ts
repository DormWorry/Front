import { useState, useEffect, useCallback } from 'react'
import deliveryRoomApi, {
  DeliveryRoom,
  FilterDeliveryRoomDto,
} from '../../api/deliveryRoomApi'

interface UseDeliveryRoomsProps {
  initialFilters?: FilterDeliveryRoomDto
  autoFetch?: boolean
}

interface UseDeliveryRoomsResult {
  rooms: DeliveryRoom[]
  loading: boolean
  error: Error | null
  fetchRooms: (filters?: FilterDeliveryRoomDto) => Promise<void>
  categories: { key: string; name: string }[]
  fetchingCategories: boolean
}

export const useDeliveryRooms = ({
  initialFilters = {},
  autoFetch = true,
}: UseDeliveryRoomsProps = {}): UseDeliveryRoomsResult => {
  const [rooms, setRooms] = useState<DeliveryRoom[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [categories, setCategories] = useState<{ key: string; name: string }[]>(
    [],
  )
  const [fetchingCategories, setFetchingCategories] = useState<boolean>(false)

  const fetchRooms = useCallback(async (filters?: FilterDeliveryRoomDto) => {
    setLoading(true)
    setError(null)
    try {
      const data = await deliveryRoomApi.getAllRooms(filters)
      setRooms(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('알 수 없는 오류가 발생했습니다'),
      )
      console.error('배달방 조회 중 오류 발생:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    setFetchingCategories(true)
    try {
      const data = await deliveryRoomApi.getAllCategories()
      setCategories(data)
    } catch (err) {
      console.error('카테고리 조회 중 오류 발생:', err)
    } finally {
      setFetchingCategories(false)
    }
  }, [])

  useEffect(() => {
    if (autoFetch) {
      fetchRooms(initialFilters)
    }
    fetchCategories()
  }, [autoFetch, fetchRooms, fetchCategories, initialFilters])

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    categories,
    fetchingCategories,
  }
}
