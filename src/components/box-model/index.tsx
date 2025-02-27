import styled from 'styled-components'

interface IProps {
  imgSrc?: string
  title: string
  description: string
}

const BoxModel = ({ imgSrc, title, description }: IProps) => {
  return (
    <BoxContainer>
      {imgSrc && <IconImage src={imgSrc} alt="Icon" />}
      <ContentWrapper>
        <Title>{title}</Title>
        <Description dangerouslySetInnerHTML={{ __html: description }} />
      </ContentWrapper>
    </BoxContainer>
  )
}

interface CalendarBoxProps {
  category: string
  title: string
  content: string
  date: string
}

export const CalendarBox = ({
  category,
  title,
  content,
  date,
}: CalendarBoxProps) => {
  // 50글자 제한 적용
  const limitedContent = content.length > 50 ? `${content.substring(0, 50)}...` : content;
  
  return (
    <CalendarBoxContainer>
      <CalendarTag>{category}</CalendarTag>
      <CalendarTitle>{title}</CalendarTitle>
      <CalendarContent>{limitedContent}</CalendarContent>
      <CalendarDate>{date}</CalendarDate>
    </CalendarBoxContainer>
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

  @media (max-width: 1200px) {
    width: 400px;
  }

  @media (max-width: 1024px) {
    width: 100%;
    max-width: 450px;
    height: 250px; /* 고정된 높이 유지 */
    padding: 30px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 230px; /* 모바일에서도 높이 고정 */
    padding: 25px;
    min-width: 0; /* 모바일에서 최소 너비 제거 */
  }
`

const IconImage = styled.img`
  width: 70px;
  height: auto;
  margin: 0 0 0 auto;

  @media (max-width: 768px) {
    width: 60px;
  }
`

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 30px;

  @media (max-width: 768px) {
    margin-top: 20px;
  }
`

const Title = styled.div`
  font-size: 24px;
  font-family: 'Pretendard-bold';
  color: black;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`

const Description = styled.div`
  font-size: 12px;
  font-family: 'Pretendard';
  color: #808080;
  text-align: left;
`

export const CalendarBoxContainer = styled.div`
  width: 100%;
  height: 260px; /* 고정 높이 */
  display: flex;
  flex-direction: column;
  border: solid 1px rgba(169, 169, 169, 0.3);
  border-radius: 20px;
  padding: 20px;
  background: white;
  box-shadow:
    0px 10px 30px rgba(0, 0, 0, 0.1),
    0px 1px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  box-sizing: border-box;
  margin: 20px auto;

  &:hover {
    transform: translateY(-5px);
    box-shadow:
      0px 15px 35px rgba(0, 0, 0, 0.15),
      0px 3px 10px rgba(0, 0, 0, 0.07);
  }

  @media (max-width: 1024px) {
    width: 100%;
    max-width: 450px;
    height: 250px; /* 고정된 높이 유지 */
    padding: 20px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    height: 230px; /* 모바일에서도 높이 고정 */
    padding: 16px;
    margin: 15px auto;
  }
`

export const CalendarTag = styled.div`
  display: inline-block;
  padding: 8px 16px;
  background: #3a7859;
  color: white;
  border-radius: 20px;
  font-size: 14px;
  margin-bottom: 15px;
  width: fit-content;
`

export const CalendarTitle = styled.h3`
  font-size: 20px;
  font-family: 'Pretendard-bold';
  margin: 0 0 15px 0;
  line-height: 1.4;
  color: black;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`

export const CalendarContent = styled.p`
  font-size: 16px;
  font-family: 'Pretendard';
  color: #666;
  line-height: 1.6;
  flex-grow: 1;
  overflow: hidden;
  margin: 0 0 10px 0;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`

export const CalendarDate = styled.p`
  font-size: 14px;
  font-family: 'Pretendard';
  color: #999;
  margin-top: 10px;
  text-align: right;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`
