import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #666;
`;

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // 기본 경로('/')에서 auth 페이지로 자동 리디렉션
    router.push('/auth');
  }, [router]);

  return (
    <Container>
      <LoadingText>리디렉션 중...</LoadingText>
    </Container>
  );
}
