import React, { useState } from 'react'
import styled from 'styled-components'
import { FoodCategoryType } from './FoodCategory'

interface CreateRoomModalProps {
  categories: FoodCategoryType[]
  onCreateRoom: (roomData: {
    restaurantName: string
    minOrderAmount: number
    deliveryFee: number
    categoryId: string
    description?: string
  }) => void
  onClose: () => void
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  categories,
  onCreateRoom,
  onClose,
}) => {
  const [restaurantName, setRestaurantName] = useState('')
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0)
  const [deliveryFee, setDeliveryFee] = useState<number>(0)
  const [categoryId, setCategoryId] = useState<string>('')
  const [orderLink, setOrderLink] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !restaurantName ||
      minOrderAmount <= 0 ||
      deliveryFee <= 0 ||
      !categoryId
    ) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    onCreateRoom({
      restaurantName,
      minOrderAmount,
      deliveryFee,
      categoryId,
      description: orderLink || undefined, // 공동주문 링크를 description 필드에 저장
    })

    onClose()
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>배달 방 만들기</ModalTitle>
          <CloseButton onClick={onClose}>X</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="restaurantName">식당명 *</Label>
            <Input
              id="restaurantName"
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="식당명을 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="category">카테고리 *</Label>
            <Select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">카테고리 선택</option>
              {categories && categories.length > 0 && categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormRow>
            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="minOrderAmount">최소주문금액 (원) *</Label>
              <Input
                id="minOrderAmount"
                type="number"
                value={minOrderAmount || ''}
                onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                placeholder="0"
                min="0"
                required
              />
            </FormGroup>

            <FormGroup style={{ flex: 1 }}>
              <Label htmlFor="deliveryFee">배달비 (원) *</Label>
              <Input
                id="deliveryFee"
                type="number"
                value={deliveryFee || ''}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                placeholder="0"
                min="0"
                required
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="orderLink">공동주문 링크 (선택사항)</Label>
            <Input
              id="orderLink"
              type="url"
              value={orderLink}
              onChange={(e) => setOrderLink(e.target.value)}
              placeholder="공동주문 링크를 입력하세요 (예: https://baemin.com/share...)"
            />
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              취소
            </CancelButton>
            <SubmitButton type="submit">방 생성하기</SubmitButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
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

const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
`

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e5e5;
  }
`

const Form = styled.form`
  padding: 20px;
`

const FormGroup = styled.div`
  margin-bottom: 16px;
`

const FormRow = styled.div`
  display: flex;
  gap: 16px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #444;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fafafa;
  transition: all 0.2s ease;
  color: #444;

  &:focus {
    outline: none;
    border-color: #13cfb8;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(19, 207, 184, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fafafa;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  color: #444;
  &:focus {
    outline: none;
    border-color: #13cfb8;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(19, 207, 184, 0.1);
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fafafa;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;
  color: #444;

  &:focus {
    outline: none;
    border-color: #13cfb8;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(19, 207, 184, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`

const Button = styled.button`
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
`

const CancelButton = styled(Button)`
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #666;

  &:hover {
    background-color: #e5e5e5;
  }
`

const SubmitButton = styled(Button)`
  background-color: #13cfb8;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '+';
    margin-right: 6px;
    font-size: 18px;
    font-weight: bold;
  }

  &:hover {
    background-color: #0b9466;
  }
`

export default CreateRoomModal
