import styled from 'styled-components'

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
`

export const TextContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 100px;
  padding: 0px 50px;
`

export const Slogan = styled.div`
  font-size: 28px;
  font-family: 'Pretendard-bold';
  margin-bottom: 1rem;
`

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const Title = styled.div`
  font-size: 52px;
`
export const HighlightTitle = styled(Title)`
  font-family: 'Pretendard-bold';
`
export const Highlight = styled.span`
  font-family: 'Pretendard-extra-bold';
  color: #13cfb8;
`

export const Description = styled.div`
  font-size: 24px;
  text-align: left;
`
