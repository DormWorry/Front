import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import authApi from '../../api/auth';

const AuthPage = () => {
  const router = useRouter();

  useEffect(() => {
    // 카카오 로그인 페이지로 리다이렉트
    const loginUrl = authApi.getKakaoLoginUrl();
    window.location.href = loginUrl;
  }, []);

  return (
    <Container>
      <LoadingText>카카오 로그인 페이지로 이동 중입니다...</LoadingText>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--gray-100);
`;

const LoadingText = styled.p`
  font-size: 18px;
  color: var(--gray-700);
`;

export default AuthPage;
