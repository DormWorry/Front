import React, { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import authApi from '../api/auth';

const LoginButton = styled.a<{ disabled?: boolean }>`
  display: inline-block;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin: 20px 0;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};
  position: relative;
  width: 300px;
  height: 45px;
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-3px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.1)'};
  }
`;

const ErrorText = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
`;

interface KakaoLoginButtonProps {
  onLoginStart?: () => void;
  onLoginError?: (error: string) => void;
}

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({ 
  onLoginStart, 
  onLoginError 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (onLoginStart) {
        onLoginStart();
      }
      
      // 로그인 진행은 href 링크로 자동 이동하므로 추가 작업 필요 없음
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '로그인 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      
      if (onLoginError) {
        onLoginError(errorMessage);
      }
      
      e.preventDefault();
      setIsLoading(false);
    }
  };
  
  const kakaoLoginUrl = authApi.getKakaoLoginUrl();
  
  return (
    <>
      <LoginButton 
        href={kakaoLoginUrl} 
        onClick={handleLogin}
        disabled={isLoading}
      >
        <Image 
          src="/kakao_login_large_wide.png" 
          alt="카카오 로그인" 
          layout="fill"
          objectFit="contain"
          priority
        />
      </LoginButton>
      {error && <ErrorText>{error}</ErrorText>}
    </>
  );
};

export default KakaoLoginButton;
