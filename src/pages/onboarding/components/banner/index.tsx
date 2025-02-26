import React from 'react'
import * as S from './banner-styles'
const Banner: React.FC = () => {
  return (
    <S.BannerContainer>
      <S.TextContainer>
        <S.Slogan>Together, We Create a Happy Dorm Life</S.Slogan>
        <S.TitleContainer>
          <S.Title>새로운 디지털 문화의 도입으로</S.Title>
          <S.HighlightTitle>
            기숙사 생활에 <S.Highlight>혁신</S.Highlight>과{' '}
            <S.Highlight>편리함</S.Highlight>을 선사하다.
          </S.HighlightTitle>
        </S.TitleContainer>
        <S.Description>
          기숙사생들 간의 네트워킹 공간을 마련해 소통과 정보 공유를 통해
          불편함을 해소합니다.
          <br />
          혁신적 솔루션으로 기숙사 생활의 편리함을 선사합니다.
        </S.Description>
      </S.TextContainer>
    </S.BannerContainer>
  )
}

export default Banner
