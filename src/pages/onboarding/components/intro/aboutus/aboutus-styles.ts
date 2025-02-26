import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
`

export const RowContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  align-items: center;
`

export const IntroGroup = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
`

export const ThinkingIcon = styled.img`
  width: 128px;
  height: auto;
`

export const IntroTitle = styled.div`
  font-size: 28px;
  font-family: 'Pretendard-bold';
`

export const AboutUsButton = styled.button`
  width: 300px;
  height: 60px;
  background-color: #00bfa6;
  border: none;
  border-radius: 30px;
  color: white;
  font-size: 18px;
  font-family: 'Pretendard-bold';
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: auto;
  margin-bottom: auto;
  transition: all 0.3s ease;

  &:hover {
    background-color: #00a895;
    transform: translateY(-3px);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  }
`
