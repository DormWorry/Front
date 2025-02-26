import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  background: #3b3b3b;
  padding: 60px 20px 80px;
  position: relative;
`

export const Title = styled.div`
  font-family: 'Pretendard-bold';
  color: white;
  font-size: 28px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding-left: 20px;
  position: relative;
`

export const SubTitle = styled.span`
  font-family: 'Pretendard-bold';
  font-size: 16px;
  color: #ccc;
  margin-left: 10px;
`

export const SliderContainer = styled.div`
  position: relative;
  max-width: 1440px;
  margin: 0 auto;
  overflow: hidden;
  padding: 15px 0;
`

export const CardWrapper = styled.div<{ transform: string }>`
  display: flex;
  transition: transform 0.5s ease;
  transform: ${(props) => props.transform};
  gap: 30px;
  padding: 0 20px;
`

export const CardItem = styled.div`
  flex: 0 0 calc(33.333% - 20px);
  min-width: 300px;
  box-sizing: border-box;
  margin: 15px 0;

  @media (max-width: 1200px) {
    flex: 0 0 calc(50% - 15px);
  }

  @media (max-width: 768px) {
    flex: 0 0 100%;
  }

  &:hover > div {
    transform: translateY(-10px);
    box-shadow:
      0px 20px 40px rgba(0, 0, 0, 0.2),
      0px 5px 15px rgba(0, 0, 0, 0.1);
  }
`

export const NavigationButtons = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 10px;
`

export const NavButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(120, 120, 120, 0.2);
    color: rgba(255, 255, 255, 0.3);
    transform: scale(1);

    &:hover {
      background: rgba(120, 120, 120, 0.2);
      transform: scale(1);
    }
  }
`
