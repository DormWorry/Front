import React, { useState, useEffect } from 'react'
import * as S from './letter-styles'
import { useForm, Controller } from 'react-hook-form'
import { containsProfanity } from '../../constants/profanity-filter'
import { ComposeFormProps, LetterFormData } from './types'

/**
 * 편지 작성 양식 컴포넌트
 */
const ComposeForm: React.FC<ComposeFormProps> = ({
  onCancel,
  onSubmit,
  initialRecipient = '',
}) => {
  const [isAnonymous, setIsAnonymous] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LetterFormData>({
    defaultValues: {
      sender: '1205호', // 유저 정보(호수)
      recipient: initialRecipient,
      title: '',
      content: '',
    },
    mode: 'onChange', // 입력과 동시에 유효성 검사
  })

  useEffect(() => {
    if (initialRecipient) {
      setValue('recipient', initialRecipient)
    }
  }, [initialRecipient, setValue])

  // 폼 필드 유효성 검사
  const validateField = (fieldName: string, value: string) => {
    if (!value.trim()) {
      return `${fieldName}을(를) 입력해주세요.`
    }

    if (containsProfanity(value)) {
      return '부적절한 표현이 포함되어 있습니다. 다시 작성해주세요.'
    }

    return true
  }

  // 폼 취소 처리
  const handleCancel = () => {
    if (window.confirm('편지 작성을 취소하시겠습니까?')) {
      onCancel()
    }
  }

  // 폼 제출 처리
  const handleFormSubmit = (data: LetterFormData) => {
    onSubmit({
      ...data,
      sender: isAnonymous ? '익명' : data.sender,
    })
  }

  return (
    <S.ComposeContainer>
      <S.ComposeForm onSubmit={handleSubmit(handleFormSubmit)}>
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '0.5rem' }}>
          <S.InputGroup>
            <S.InputLabel htmlFor="title">제목</S.InputLabel>
            <Controller
              name="title"
              control={control}
              rules={{
                required: '제목을 입력해주세요.',
                validate: (value) => validateField('제목', value),
              }}
              render={({ field }) => (
                <S.Input
                  id="title"
                  {...field}
                  placeholder="제목을 입력하세요"
                />
              )}
            />
            {errors.title && <S.ErrorText>{errors.title.message}</S.ErrorText>}
          </S.InputGroup>

          <S.InputGroup>
            <S.InputLabel htmlFor="recipient">받는 사람 (호수)</S.InputLabel>
            <Controller
              name="recipient"
              control={control}
              rules={{
                required: '받는 사람을 입력해주세요.',
                validate: (value) => validateField('받는 사람', value),
              }}
              render={({ field }) => (
                <S.Input
                  id="recipient"
                  {...field}
                  placeholder="예: 101호, 202호"
                />
              )}
            />
            {errors.recipient && (
              <S.ErrorText>{errors.recipient.message}</S.ErrorText>
            )}
          </S.InputGroup>

          <S.InputGroup>
            <S.InputLabel htmlFor="sender">보내는 사람 (호수)</S.InputLabel>
            <Controller
              name="sender"
              control={control}
              rules={{
                required: '보내는 사람을 입력해주세요.',
                validate: (value) =>
                  !isAnonymous ? validateField('보내는 사람', value) : true,
              }}
              render={({ field }) => (
                <S.Input
                  id="sender"
                  {...field}
                  disabled={isAnonymous}
                  //1205호 -> 실제 사용자 호수
                  value={isAnonymous ? '익명' : '1205호'}
                  placeholder="예: 303호, 404호"
                />
              )}
            />
            {errors.sender && (
              <S.ErrorText>{errors.sender.message}</S.ErrorText>
            )}
            <S.CheckboxLabel>
              <S.Checkbox
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              익명으로 보내기
            </S.CheckboxLabel>
          </S.InputGroup>

          <S.InputGroup>
            <S.InputLabel htmlFor="content">내용</S.InputLabel>
            <Controller
              name="content"
              control={control}
              rules={{
                required: '내용을 입력해주세요.',
                validate: (value) => validateField('내용', value),
              }}
              render={({ field }) => (
                <S.TextArea
                  id="content"
                  {...field}
                  placeholder="내용을 입력하세요"
                />
              )}
            />
            {errors.content && (
              <S.ErrorText>{errors.content.message}</S.ErrorText>
            )}
          </S.InputGroup>
        </div>

        <S.ButtonGroup>
          <S.CancelButton type="button" onClick={handleCancel}>
            취소
          </S.CancelButton>
          <S.SubmitButton type="submit">편지보내기</S.SubmitButton>
        </S.ButtonGroup>
      </S.ComposeForm>
    </S.ComposeContainer>
  )
}

export default ComposeForm
