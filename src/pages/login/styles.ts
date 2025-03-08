import styled from 'styled-components'

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  padding-top: 150px;
`

export const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  height: 500px;
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`

export const Logo = styled.img`
  width: 300px;
  height: auto;
  margin-bottom: 100px;
`

export const Title = styled.h1`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`

export const Subtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.5;
`

export const SocialButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const KakaoButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background-color: #fee500;
  color: #000000;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f6dc00;
  }

  svg,
  img {
    margin-right: 0.8rem;
    width: 24px;
    height: 24px;
  }
`
