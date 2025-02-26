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
      <S.RowContainer>
        <S.IntroGroup>
          <S.ThinkingIcon src="/svgs/thinkingface.svg" alt="Thinking Icon" />
          <S.IntroTitle>
            해피투게더, <br />
            어떤 서비스인가요?
          </S.IntroTitle>
        </S.IntroGroup>

        {topRowServices.map((service) => (
          <BoxModel
            key={service.id}
            imgSrc={service.imgSrc}
            title={service.title}
            description={service.description}
          />
        ))}
      </S.RowContainer>
      <S.RowContainer>
        {bottomRowServices.map((service) => (
          <BoxModel
            key={service.id}
            imgSrc={service.imgSrc}
            title={service.title}
            description={service.description}
          />
        ))}

        <S.AboutUsButton onClick={() => console.log('About Us button clicked')}>
          ABOUT US
        </S.AboutUsButton>
      </S.RowContainer>
    </S.Container>
  )
}

export default AboutUsComponent
