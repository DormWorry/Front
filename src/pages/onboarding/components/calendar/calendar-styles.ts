import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  background: #3b3b3b;
  padding: 60px 20px 80px;

  @media (max-width: 768px) {
    padding: 40px 16px 60px;
  }
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

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 30px;
    padding-left: 10px;
    gap: 15px;
  }
`

export const SubTitle = styled.span`
  font-family: 'Pretendard-bold';
  font-size: 16px;
  color: #ccc;
  margin-left: 10px;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-left: 5px;
  }
`

export const SliderContainer = styled.div`
  position: relative;
  max-width: 1440px;
  margin: 0 auto;
  overflow: hidden;
  padding: 0 20px;
`

export const CardWrapper = styled.div<{ transform: string }>`
  display: flex;
  transition: transform 0.5s ease;
  transform: ${(props) => props.transform};
  gap: 20px;

  @media (max-width: 768px) {
    gap: 15px;
  }
`

export const CardItem = styled.div`
  flex: 0 0 calc(33.333% - 14px);
  min-width: 250px;
  box-sizing: border-box;
  margin: 15px 0;

  @media (max-width: 1200px) {
    flex: 0 0 calc(50% - 10px);
  }

  @media (max-width: 768px) {
    flex: 0 0 calc(100% - 10px);
    min-width: 220px;
    margin: 10px 0;
  }

  &:hover > div {
    transform: translateY(-5px);
    box-shadow:
      0px 15px 30px rgba(0, 0, 0, 0.15),
      0px 5px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
`

export const NavigationButtons = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    right: 10px;
    gap: 8px;
  }
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

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

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
