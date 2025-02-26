/* 서비스 소개에 들어갈 Box Container*/
import styled from 'styled-components'

interface IProps {
  imgSrc?: string
  title: string
  description: string
}

// 기존 BoxModel 컴포넌트
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

// 캘린더용 BoxModel 컴포넌트
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
  return (
    <CalendarBoxContainer>
      <CalendarTag>{category}</CalendarTag>
      <CalendarTitle>{title}</CalendarTitle>
      <CalendarContent>{content}</CalendarContent>
      <CalendarDate>{date}</CalendarDate>
    </CalendarBoxContainer>
  )
}

export default BoxModel

// 기존 BoxModel 컴포넌트
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

// 캘린더용 컴포넌트
export const CalendarBoxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border: solid 1px rgba(169, 169, 169, 0.3);
  border-radius: 20px;
  padding: 25px;
  background: white;
  box-shadow:
    0px 10px 30px rgba(0, 0, 0, 0.1),
    0px 1px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 300px;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
    box-shadow:
      0px 15px 35px rgba(0, 0, 0, 0.15),
      0px 3px 10px rgba(0, 0, 0, 0.07);
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
`

export const CalendarContent = styled.p`
  font-size: 16px;
  font-family: 'Pretendard';
  color: #666;
  line-height: 1.6;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`

export const CalendarDate = styled.p`
  font-size: 14px;
  font-family: 'Pretendard';
  color: #999;
  margin-top: 10px;
  text-align: right;
`
