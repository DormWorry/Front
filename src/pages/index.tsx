import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Image from 'next/image';
import KakaoLoginButton from '../components/KakaoLoginButton';
import authApi from '../api/auth';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const LoginBox = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 450px;
  width: 90%;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 16px;
  margin-bottom: 30px;
  color: #666;
`;

const AppImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const LoadingAnimation = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3396F4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 16px;
`;

const ErrorText = styled.p`
  color: #e74c3c;
  margin-top: 15px;
  font-size: 14px;
`;

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 이미 로그인 되어 있는지 확인
    const checkAuth = async () => {
      try {
        const { isLoggedIn, user } = await authApi.checkLoginStatus();
        
        if (isLoggedIn && user) {
          // 이미 로그인한 사용자는 상태에 따라 리다이렉트
          if (user.isNewUser) {
            router.push('/onboarding/user-info');
          } else {
            router.push('/main');
          }
        }
      } catch (error) {
        console.error('인증 확인 오류:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : '로그인 상태 확인 중 오류가 발생했습니다.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLoginStart = () => {
    setError(null);
  };

  const handleLoginError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <LoginContainer>
        <LoadingWrapper>
          <LoadingAnimation />
          <LoadingText>로그인 상태를 확인하는 중...</LoadingText>
        </LoadingWrapper>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginBox>
        <AppImageContainer>
          <Image 
            src="/dormitory-icon.png" 
            alt="기숙사 앱 아이콘" 
            layout="fill"
            objectFit="contain"
            priority
          />
        </AppImageContainer>
        <Title>기숙사 애플리케이션</Title>
        <Subtitle>카카오 계정으로 간편하게 로그인하세요</Subtitle>
        <KakaoLoginButton 
          onLoginStart={handleLoginStart}
          onLoginError={handleLoginError}
        />
        {error && <ErrorText>{error}</ErrorText>}
      </LoginBox>
    </LoginContainer>
  );
};

export default HomePage;
