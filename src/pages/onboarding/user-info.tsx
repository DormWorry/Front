import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import authApi from '../../api/auth';
import dormitoryApi from '../../api/dormitory';

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

const Subtitle = styled.p`
  color: #666;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #3396F4;
    box-shadow: 0 0 0 2px rgba(51, 150, 244, 0.2);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #3396F4;
    box-shadow: 0 0 0 2px rgba(51, 150, 244, 0.2);
  }
`;

const Button = styled.button`
  padding: 14px;
  background-color: #3396F4;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2a7fd4;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
`;

// 사용자 정보 인터페이스
type UserFormData = {
  nickname: string;
  studentId: string;
  department: string;
  dormitoryId: string;
  roomNumber: string;
  gender: string;
};

const UserInfoPage = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [dormitories, setDormitories] = useState<Array<{ id: string; name: string }>>([]);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>();
  
  // 사용자 인증 확인 및 기숙사 정보 가져오기
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const user = await authApi.getCurrentUser();
        if (!user) {
          router.push('/');
        }
      } catch (error) {
        console.error('인증 오류:', error);
        router.push('/');
      }
    };
    
    const fetchDormitories = async () => {
      try {
        const dormitoryData = await dormitoryApi.getAllDormitories();
        setDormitories(dormitoryData);
      } catch (error) {
        console.error('기숙사 데이터 가져오기 오류:', error);
        setApiError('기숙사 정보를 불러오는데 실패했습니다.');
      }
    };
    
    verifyAuth();
    fetchDormitories();
  }, [router]);
  
  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    setApiError(null);
    
    try {
      // 프로필 업데이트 데이터 준비
      const profileData = {
        ...data,
        isNewUser: false
      };
      
      await authApi.updateUserProfile(profileData);
      router.push('/main');
    } catch (error: unknown) {
      console.error('프로필 업데이트 오류:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : '프로필 업데이트 중 오류가 발생했습니다.';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <Header>
        <Title>추가 정보 입력</Title>
        <Subtitle>기숙사 애플리케이션 사용을 위해 다음 정보를 입력해주세요.</Subtitle>
      </Header>
      
      {apiError && <ErrorMessage>{apiError}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label>이름</Label>
          <Input 
            {...register('nickname', { required: '이름을 입력해주세요' })}
            placeholder="이름을 입력하세요"
          />
          {errors.nickname && (
            <ErrorMessage>{errors.nickname.message}</ErrorMessage>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label>학번</Label>
          <Input 
            {...register('studentId', { required: '학번을 입력해주세요' })}
            placeholder="학번을 입력하세요"
          />
          {errors.studentId && (
            <ErrorMessage>{errors.studentId.message}</ErrorMessage>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label>학과</Label>
          <Input 
            {...register('department', { required: '학과를 입력해주세요' })}
            placeholder="학과를 입력하세요"
          />
          {errors.department && (
            <ErrorMessage>{errors.department.message}</ErrorMessage>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label>기숙사 선택</Label>
          <Select {...register('dormitoryId', { required: '기숙사를 선택해주세요' })}>
            <option value="">기숙사 선택</option>
            {dormitories.map((dormitory) => (
              <option key={dormitory.id} value={dormitory.id}>
                {dormitory.name}
              </option>
            ))}
          </Select>
          {errors.dormitoryId && (
            <ErrorMessage>{errors.dormitoryId.message}</ErrorMessage>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label>호실</Label>
          <Input 
            {...register('roomNumber', { required: '호실을 입력해주세요' })}
            placeholder="예: 101"
          />
          {errors.roomNumber && (
            <ErrorMessage>{errors.roomNumber.message}</ErrorMessage>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label>성별</Label>
          <Select {...register('gender', { required: '성별을 선택해주세요' })}>
            <option value="">성별 선택</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </Select>
          {errors.gender && (
            <ErrorMessage>{errors.gender.message}</ErrorMessage>
          )}
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? '처리 중...' : '저장하기'}
        </Button>
      </Form>
    </Container>
  );
};

export default UserInfoPage;
