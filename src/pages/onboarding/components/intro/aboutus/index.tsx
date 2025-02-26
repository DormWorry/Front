import React from 'react'
import * as S from './aboutus-styles'
import BoxModel from '../../../../../components/box-model'
import {
  topRowServices,
  bottomRowServices,
} from '../../../../../constants/onboard-dummy'

const AboutUsComponent: React.FC = () => {
  return (
    <S.Container>
      <S.TopSection>
        <S.IntroGroup>
          <S.ThinkingIcon src="/svgs/thinkingface.svg" alt="Thinking Icon" />
          <S.IntroTitle>
            해피투게더, <br />
            어떤 서비스인가요?
          </S.IntroTitle>
        </S.IntroGroup>
        <S.IntroDescription
          dangerouslySetInnerHTML={{
            __html:
              '해피투게더는 기숙사 생활을 더욱 편리하고 즐겁게 만들기 위한 다양한 서비스를 제공합니다.<br/> 룸메이트 매칭부터 공동 배달 주문까지, 여러분의 기숙사 라이프를 더욱 풍요롭게 만들어 드립니다.',
          }}
        ></S.IntroDescription>
      </S.TopSection>
      
      <S.ServicesGrid>
        {/* 역삼각형 배치: 상단에 하나 */}
        <S.TopServiceRow>
          {topRowServices.map((service) => (
            <BoxModel
              key={service.id}
              imgSrc={service.imgSrc}
              title={service.title}
              description={service.description}
            />
          ))}
        </S.TopServiceRow>
        
        {/* 역삼각형 배치: 하단에 두개 */}
        <S.BottomServiceRow>
          {bottomRowServices.map((service) => (
            <BoxModel
              key={service.id}
              imgSrc={service.imgSrc}
              title={service.title}
              description={service.description}
            />
          ))}
        </S.BottomServiceRow>
      </S.ServicesGrid>
    </S.Container>
  )
}

export default AboutUsComponent
