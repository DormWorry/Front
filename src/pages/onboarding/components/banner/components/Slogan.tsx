import React, { RefObject } from 'react'
import * as S from '../banner-styles'

interface SloganProps {
  typedText: string
  isTypingComplete: boolean
  sloganRef: RefObject<HTMLDivElement | null>
}
const Slogan: React.FC<SloganProps> = ({
  typedText,
  isTypingComplete,
  sloganRef,
}) => {
  return (
    <S.Slogan ref={sloganRef}>
      {typedText}
      {!isTypingComplete && <S.Cursor />}
    </S.Slogan>
  )
}

export default Slogan
