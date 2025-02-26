import React from 'react'
import * as S from './calendar-styles'
import { dormitoryNotices } from '../../../../constants/dormitory-dummy'
import { CalendarBox } from '../../../../components/box-model'
import {
  useCardLayout,
  useAutoSlide,
  useSliderNavigation,
  useSliderHover,
} from '../../../../hooks/calendar-hooks'

const Calendar: React.FC = () => {
  const { maxIndex } = useCardLayout(dormitoryNotices.length)
  const { isHovering, containerRef, handleMouseEnter, handleMouseLeave } =
    useSliderHover()
  const { currentIndex, setCurrentIndex, getTransformValue } = useAutoSlide(
    maxIndex,
    isHovering,
  )

  const { handlePrev, handleNext, isPrevDisabled, isNextDisabled } =
    useSliderNavigation(currentIndex, maxIndex, setCurrentIndex)

  return (
    <S.Container>
      <S.Title>
        기숙사 소식
        <S.SubTitle>•공지사항 •행사정보</S.SubTitle>
        <S.NavigationButtons>
          <S.NavButton
            onClick={handlePrev}
            disabled={isPrevDisabled}
            aria-label="이전"
          >
            &lt;
          </S.NavButton>
          <S.NavButton
            onClick={handleNext}
            disabled={isNextDisabled}
            aria-label="다음"
          >
            &gt;
          </S.NavButton>
        </S.NavigationButtons>
      </S.Title>

      <S.SliderContainer
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <S.CardWrapper transform={getTransformValue()}>
          {dormitoryNotices.map((notice) => (
            <S.CardItem key={notice.id}>
              <CalendarBox
                category={notice.category}
                title={notice.title}
                content={notice.content}
                date={notice.date}
              />
            </S.CardItem>
          ))}
        </S.CardWrapper>
      </S.SliderContainer>
    </S.Container>
  )
}

export default Calendar
