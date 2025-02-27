import React, { RefObject } from 'react'
import * as S from '../banner-styles'

interface TitleProps {
  title1Ref: RefObject<HTMLDivElement | null>
  title2Ref: RefObject<HTMLDivElement | null>
  highlight1Ref: RefObject<HTMLSpanElement | null>
  highlight2Ref: RefObject<HTMLSpanElement | null>
  underline1Ref: RefObject<HTMLSpanElement | null>
  underline2Ref: RefObject<HTMLSpanElement | null>
}
const Title: React.FC<TitleProps> = ({
  title1Ref,
  title2Ref,
  highlight1Ref,
  highlight2Ref,
  underline1Ref,
  underline2Ref,
}) => {
  return (
    <S.TitleContainer>
      <S.Title ref={title1Ref}>새로운 디지털 문화의 도입으로</S.Title>
      <S.HighlightTitle ref={title2Ref}>
        기숙사 생활에{' '}
        <S.Highlight ref={highlight1Ref}>
          혁신
          <S.HighlightUnderline ref={underline1Ref} />
        </S.Highlight>
        과{' '}
        <S.Highlight ref={highlight2Ref}>
          편리함
          <S.HighlightUnderline ref={underline2Ref} />
        </S.Highlight>
        을 제공하다.
      </S.HighlightTitle>
    </S.TitleContainer>
  )
}

export default Title
