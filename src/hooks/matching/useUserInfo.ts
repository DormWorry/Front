import { useState, ChangeEvent } from 'react'
import { UserInfo } from '../../pages/matching/types'
import { useRecoilValue } from 'recoil'
import { userAtom } from '../../recoil/atoms/userAtom'

interface UseUserInfoReturn {
  userInfo: UserInfo
  errors: Record<string, string>
  isFormValid: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleLocationSelect: (location: '1기숙사' | '2기숙사' | '3기숙사') => void
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>
}

export const useUserInfo = (): UseUserInfoReturn => {
  const user = useRecoilValue(userAtom)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    kakaoId: '',
    instagram: '',
    description: '',
    location: '1기숙사',
  })

  const [errors, setErrors] = useState({
    kakaoId: '',
    instagram: '',
    description: '',
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setUserInfo((prev: UserInfo) => ({
      ...prev,
      [name]: value,
    }))
    
    // 입력값 유효성 검사
    validateField(name, value)
  }

  const handleLocationSelect = (
    location: '1기숙사' | '2기숙사' | '3기숙사',
  ) => {
    setUserInfo((prev: UserInfo) => ({
      ...prev,
      location,
    }))
  }

  // 필드별 유효성 검사
  const validateField = (name: string, value: string) => {
    let errorMessage = ''

    switch (name) {
      case 'kakaoId':
        if (!value.trim()) {
          errorMessage = '카카오톡 ID를 입력해주세요'
        }
        break
      case 'description':
        if (!value.trim()) {
          errorMessage = '자기소개를 입력해주세요'
        } else if (value.length < 10) {
          errorMessage = '자기소개는 최소 10자 이상 입력해주세요'
        }
        break
      default:
        break
    }

    setErrors(prev => ({ ...prev, [name]: errorMessage }))
  }

  // 폼 전체 유효성 검사
  const isFormValid = 
    !errors.kakaoId && 
    !errors.description && 
    userInfo.kakaoId.trim() !== '' && 
    userInfo.description.trim() !== ''

  return {
    userInfo,
    errors,
    isFormValid,
    handleChange,
    handleLocationSelect,
    setUserInfo,
  }
}
