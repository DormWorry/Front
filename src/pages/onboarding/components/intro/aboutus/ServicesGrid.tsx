import React from 'react'
import * as S from './aboutus-styles'
import BoxModel from '../../../../../components/box-model'
import { topRowServices, bottomRowServices } from '../../../../../constants/onboard-dummy'
import { DivRef } from './useRefs'

interface ServicesGridProps {
  topRowRef: DivRef
  bottomRowRef: DivRef
  bottomCardRefs: DivRef[]
}

const ServicesGrid: React.FC<ServicesGridProps> = ({
  topRowRef,
  bottomRowRef,
  bottomCardRefs
}) => {
  return (
    <S.ServicesGrid>
      <S.TopServiceRow ref={topRowRef}>
        {topRowServices.map((service) => (
          <BoxModel
            key={service.id}
            imgSrc={service.imgSrc}
            title={service.title}
            description={service.description}
          />
        ))}
      </S.TopServiceRow>

      <S.BottomServiceRow ref={bottomRowRef}>
        {bottomRowServices.map((service, index) => (
          <div
            key={service.id}
            ref={bottomCardRefs[index]}
            style={{ width: '100%', maxWidth: '450px' }}
          >
            <BoxModel
              imgSrc={service.imgSrc}
              title={service.title}
              description={service.description}
            />
          </div>
        ))}
      </S.BottomServiceRow>
    </S.ServicesGrid>
  )
}

export default ServicesGrid
