/* 서비스 소개에 들어갈 Box Container*/
import styled from 'styled-components'
interface IProps {
  imgSrc: string
  title: string
  description: string
}
const BoxModel = ({ imgSrc, title, description }: IProps) => {
  return (
    <BoxContainer>
      <IconImage src={imgSrc} alt="Icon" />
      <ContentWrapper>
        <Title>{title}</Title>
        <Description dangerouslySetInnerHTML={{ __html: description }} />
      </ContentWrapper>
    </BoxContainer>
  )
}

export default BoxModel

const BoxContainer = styled.div`
  width: 450px;
  height: 250px;
  display: flex;
  flex-direction: column;
  border: solid 1px rgba(169, 169, 169, 0.3);
  border-radius: 20px;
  padding: 40px;
  background: white;
  box-shadow:
    0px 10px 30px rgba(0, 0, 0, 0.1),
    0px 1px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow:
      0px 15px 35px rgba(0, 0, 0, 0.15),
      0px 3px 10px rgba(0, 0, 0, 0.07);
  }
`

const IconImage = styled.img`
  width: 70px;
  height: auto;
  margin: 0 0 0 auto;
`

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`

const Title = styled.div`
  font-size: 24px;
  font-family: 'Pretendard-bold';
  color: black;
  text-align: left;
`

const Description = styled.div`
  font-size: 12px;
  font-family: 'Pretendard';
  color: #808080;
  text-align: left;
`
