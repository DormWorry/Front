import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import authApi, { UserProfile } from '../../api/auth'
import { useRecoilState } from 'recoil'
import { userAtom } from '../../recoil/atoms/userAtom'

interface UserInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  kakaoId?: number | null
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  kakaoId,
}) => {
  const [formData, setFormData] = useState<Omit<UserProfile, 'isNewUser'>>({
    nickname: '',
    studentId: '',
    department: '',
    dormitoryId: '',
    roomNumber: '',
    gender: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // React 18로 다운그레이드 후 useRecoilState 사용 시도
  const [userState, setUserState] = useRecoilState(userAtom)

  useEffect(() => {
    // 컴포넌트가 마운트될 때만 실행
    console.log('현재 사용자 상태:', userState)
  }, [userState])

  if (!isOpen) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const emptyFields = Object.entries(formData)
        .filter(([, value]) => !value)
        .map(([key]) => key)

      if (emptyFields.length > 0) {
        throw new Error(`다음 항목을 입력해주세요: ${emptyFields.join(', ')}`)
      }

      const profileData: UserProfile = {
        ...formData,
        kakaoId: kakaoId || undefined,
      }

      await authApi.updateUserProfile(profileData)

      const updatedUser = {
        ...formData,
        kakaoId: kakaoId || undefined,
        isNewUser: false,
        isLoggedIn: true,
      }

      localStorage.setItem('userInfo', JSON.stringify(updatedUser))

      // React 18에서는 useRecoilState 직접 사용 시도
      setUserState(updatedUser)

      onSuccess()
    } catch (err) {
      console.error('프로필 업데이트 실패:', err)
      setError(
        err instanceof Error
          ? err.message
          : '프로필 업데이트 중 오류가 발생했습니다.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h2>사용자 정보 입력</h2>
          <p>서비스 이용을 위해 추가 정보를 입력해주세요.</p>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="studentId">학번</Label>
            <Input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="학번을 입력하세요"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="department">학과</Label>
            <Input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="학과를 입력하세요"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="dormitoryId">기숙사</Label>
            <Select
              id="dormitoryId"
              name="dormitoryId"
              value={formData.dormitoryId}
              onChange={handleChange}
            >
              <option value="">기숙사를 선택하세요</option>
              <option value="1">1기숙사</option>
              <option value="2">2기숙사</option>
              <option value="3">3기숙사</option>
              <option value="4">4기숙사</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="roomNumber">방 번호</Label>
            <Input
              type="text"
              id="roomNumber"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              placeholder="방 번호를 입력하세요"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="gender">성별</Label>
            <Select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">성별을 선택하세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </Select>
          </FormGroup>

          <ButtonGroup>
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? '처리 중...' : '저장하기'}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  )
}

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

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`

const ModalHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
  position: relative;

  h2 {
    margin: 0 0 8px;
    font-size: 24px;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3396f4;
  }
`

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #3396f4;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`

const SubmitButton = styled.button`
  padding: 12px 24px;
  background-color: #3396f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2a7fd4;
  }

  &:disabled {
    background-color: #a0c8f0;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  padding: 12px;
  background-color: #ffebee;
  color: #d32f2f;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
`

export default UserInfoModal
