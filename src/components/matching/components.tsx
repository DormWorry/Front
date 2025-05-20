import React from 'react';
import styled from 'styled-components';

// 기본 버튼 컴포넌트
export const Button = styled.button`
  padding: 10px 16px;
  background-color: #6161ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #5252e0;
  }
`;

// 에러 메시지 컴포넌트
export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.07);
  margin: 20px;
  
  h3 {
    color: #e74c3c;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    margin-bottom: 20px;
  }
`;

// 대기 컨테이너
export const WaitingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  height: 60vh;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #333;
  }
  
  p {
    color: #666;
    margin-bottom: 20px;
  }
`;

// 스피너 애니메이션
export const SpinnerContainer = styled.div`
  margin: 20px 0;
`;

export const WaitingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(97, 97, 255, 0.2);
  border-top: 5px solid #6161ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// 매치가 없을 때 컨테이너
export const NoMatchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  height: 60vh;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #333;
  }
  
  p {
    color: #666;
    margin-bottom: 20px;
  }
`;

// 버튼 그룹
export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export const ActionButton = styled(Button)`
  background-color: #6161ff;
`;

export const SecondaryButton = styled(Button)`
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  
  &:hover {
    background-color: #e5e5e5;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;
