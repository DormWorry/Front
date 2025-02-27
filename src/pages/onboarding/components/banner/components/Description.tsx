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
      기숙사 생활이 보다 편리하고 즐거워질 수 있도록 돕는 서비스를 제공합니다.
    </S.Description>
  )
}

export default Description
