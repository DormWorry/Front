import React from 'react';
import styled from 'styled-components';
import authApi from '../api/auth';

const LoginButton = styled.a`
  display: inline-block;
  cursor: pointer;
  margin: 20px 0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  img {
    width: 300px;
    height: auto;
  }
`;

const KakaoLoginButton: React.FC = () => {
  const kakaoLoginUrl = authApi.getKakaoLoginUrl();
  
  return (
    <LoginButton href={kakaoLoginUrl}>
      <img 
        src="/kakao_login_large_wide.png" 
        alt="카카오 로그인" 
        width={300} 
        height={45}
      />
    </LoginButton>
  );
};

export default KakaoLoginButton;
