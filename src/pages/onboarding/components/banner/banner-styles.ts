import styled, { keyframes } from 'styled-components'

export const BannerContainer = styled.div`
  position: relative;
  width: 100vw;
  height: calc(100vh - 70px);
  background-image: url('/banner.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.65);
  overflow: hidden;
`

export const TextContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 100px;
  padding: 0px 50px;

  @media (max-width: 768px) {
    gap: 60px;
    padding: 0px 30px;
  }

  @media (max-width: 480px) {
    gap: 40px;
    padding: 0px 20px;
  }
`

export const Slogan = styled.div`
  font-size: 24px;
  font-family: 'Pretendard-bold';
  margin-bottom: 1rem;
  opacity: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`

export const Title = styled.div`
  font-size: 44px;
  opacity: 0;
  transform: translateY(20px);

  @media (max-width: 768px) {
    font-size: 24px !important;
  }

  @media (max-width: 480px) {
    font-size: 28px;
  }
`

export const HighlightTitle = styled(Title)`
  font-family: 'Pretendard-bold';
`

export const Highlight = styled.span`
  font-family: 'Pretendard-extra-bold';
  color: #13cfb8;
  position: relative;
  display: inline-block;
`

export const Description = styled.div`
  font-size: 16px;
  text-align: left;
  line-height: 1.5;
  opacity: 0;

  @media (max-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`

export const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`

export const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: #13cfb8;
  margin-left: 4px;
  animation: ${blink} 0.7s infinite;
  vertical-align: middle;
`

export const HighlightUnderline = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #13cfb8;
  transform-origin: left;
  transform: scaleX(0);
`
