import { useState, ChangeEvent } from 'react'
import { UserInfo } from '../../pages/matching/types'

interface UseUserInfoReturn {
  userInfo: UserInfo
  isFormValid: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleLocationSelect: (location: '1기숙사' | '2기숙사' | '3기숙사') => void
}

export const useUserInfo = (): UseUserInfoReturn => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    kakaoId: '',
    instagram: '',
    description: '',
    location: '1기숙사',
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setUserInfo((prev: UserInfo) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLocationSelect = (
    location: '1기숙사' | '2기숙사' | '3기숙사',
  ) => {
    setUserInfo((prev: UserInfo) => ({
      ...prev,
      location,
    }))
  }

  const isFormValid = Boolean(
    userInfo.kakaoId &&
      userInfo.instagram &&
      userInfo.description &&
      userInfo.location,
  )

  return {
    userInfo,
    isFormValid,
    handleChange,
    handleLocationSelect,
  }
}
