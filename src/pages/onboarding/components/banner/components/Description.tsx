import React, { RefObject } from 'react'
import * as S from '../banner-styles'

interface DescriptionProps {
  descRef: RefObject<HTMLDivElement | null>
}

const Description: React.FC<DescriptionProps> = ({ descRef }) => {
  return (
    <S.Description ref={descRef}>
      기숙사생들 간의 네트워킹 공간을 마련해 소통과 정보 공유를 통해 불편함을
      해소합니다.
      <br />
      혁신적 솔루션으로 기숙사 생활의 편리함을 선사합니다.
    </S.Description>
  )
}

export default Description
