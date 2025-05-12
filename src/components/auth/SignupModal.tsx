import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import { userAtom } from '@/atoms/userAtom';
import authApi from '@/api/auth';

// 성별 옵션
const genderOptions = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
  { value: 'OTHER', label: '기타' },
];

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  kakaoId: string;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, kakaoId }) => {
  const router = useRouter();
  const setUser = useSetRecoilState(userAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    studentId: '',
    department: '',
    dormitoryId: 1,  // 기본값
    roomNumber: '',
    gender: '',
  });

  const [step, setStep] = useState(1);  // 단계별 회원가입 폼 (1: 기본정보, 2: 추가정보)
  const [dormitories, setDormitories] = useState([
    { id: 1, name: '제1생활관' },
    { id: 2, name: '제2생활관' },
    { id: 3, name: '제3생활관' },
    { id: 4, name: '제4생활관' },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'dormitoryId' ? parseInt(value, 10) : value,
    });
  };

  const handleNextStep = () => {
    // 기본정보 검증
    if (step === 1) {
      if (!formData.nickname || !formData.email) {
        setError('닉네임과 이메일은 필수입니다.');
        return;
      }
      setError(null);
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 회원가입 정보 제출
      const profileData = {
        ...formData,
        kakaoId: kakaoId,
      };

      await authApi.updateUserProfile(profileData);

      // 사용자 상태 업데이트
      setUser({
        ...formData,
        kakaoId,
        isNewUser: false,
        isLoggedIn: true,
      });

      // 모달 닫기
      onClose();
      
      // 메인 페이지로 리디렉션
      router.push('/main');
    } catch (error) {
      console.error('회원가입 오류:', error);
      setError(error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{step === 1 ? '회원 정보 입력' : '추가 정보 입력'}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            {step === 1 ? (
              // 기본 정보 입력 화면
              <>
                <FormGroup>
                  <Label htmlFor="nickname">닉네임</Label>
                  <Input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    placeholder="닉네임을 입력하세요"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="이메일을 입력하세요"
                    required
                  />
                </FormGroup>

                <ButtonGroup>
                  <NextButton type="button" onClick={handleNextStep}>
                    다음 단계
                  </NextButton>
                </ButtonGroup>
              </>
            ) : (
              // 추가 정보 입력 화면
              <>
                <FormGroup>
                  <Label htmlFor="studentId">학번</Label>
                  <Input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="학번을 입력하세요"
                    required
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
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="dormitoryId">기숙사</Label>
                  <Select
                    id="dormitoryId"
                    name="dormitoryId"
                    value={formData.dormitoryId}
                    onChange={handleChange}
                    required
                  >
                    {dormitories.map((dorm) => (
                      <option key={dorm.id} value={dorm.id}>
                        {dorm.name}
                      </option>
                    ))}
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
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="gender">성별</Label>
                  <Select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">성별을 선택하세요</option>
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <ButtonGroup>
                  <BackButton type="button" onClick={handlePrevStep}>
                    이전
                  </BackButton>
                  <SubmitButton type="submit" disabled={isLoading}>
                    {isLoading ? '처리중...' : '가입 완료'}
                  </SubmitButton>
                </ButtonGroup>
              </>
            )}
          </Form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

// 스타일 컴포넌트
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
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eaeaea;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  line-height: 1;
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #90d1ca;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #90d1ca;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

const NextButton = styled(Button)`
  background-color: #90d1ca;
  color: white;
  width: 100%;

  &:hover {
    background-color: #7cbeb7;
  }
`;

const BackButton = styled(Button)`
  background-color: #f0f0f0;
  color: #666;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #90d1ca;
  color: white;
  
  &:hover {
    background-color: #7cbeb7;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background-color: #fdecea;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 0.9rem;
`;

export default SignupModal;
