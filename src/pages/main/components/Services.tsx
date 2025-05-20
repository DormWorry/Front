import React from 'react'
import * as M from '../main-styles'
import { useRouter } from 'next/router'

const ServiceSection: React.FC = () => {
  const router = useRouter()

  // 각 기능 페이지로 이동하는 핸들러
  const navigateTo = (path: string) => {
    router.push(path)
  }

  return (
    <M.ServiceSection>
      <M.SectionTitle>서비스</M.SectionTitle>
      <M.ServiceGrid>
        <M.ServiceCard onClick={() => navigateTo('/matching')}>
          <M.ServiceIconWrapper>
            <M.ServiceIcon>👥</M.ServiceIcon>
          </M.ServiceIconWrapper>
          <M.ServiceCardContent>
            <M.ServiceTitle>룸메이트 매칭</M.ServiceTitle>
            <M.ServiceDescription>
              나와 잘 맞는 룸메이트를 찾아보세요. 취향과 생활 패턴을 고려한 매칭
              시스템을 제공합니다.
            </M.ServiceDescription>
          </M.ServiceCardContent>
        </M.ServiceCard>

        <M.ServiceCard onClick={() => navigateTo('/letter')}>
          <M.ServiceIconWrapper>
            <M.ServiceIcon>💌</M.ServiceIcon>
          </M.ServiceIconWrapper>
          <M.ServiceCardContent>
            <M.ServiceTitle>마음의 편지</M.ServiceTitle>
            <M.ServiceDescription>
              익명으로 마음을 전하고 소통해보세요. 기숙사 생활 속 따뜻한 인연을
              만들어보세요.
            </M.ServiceDescription>
          </M.ServiceCardContent>
        </M.ServiceCard>

        <M.ServiceCard onClick={() => navigateTo('/order')}>
          <M.ServiceIconWrapper>
            <M.ServiceIcon>🍕</M.ServiceIcon>
          </M.ServiceIconWrapper>
          <M.ServiceCardContent>
            <M.ServiceTitle>공동 주문</M.ServiceTitle>
            <M.ServiceDescription>
              배달비를 절약하는 공동 주문 시스템! 같은 기숙사 사람들과 함께
              주문하세요.
            </M.ServiceDescription>
          </M.ServiceCardContent>
        </M.ServiceCard>
      </M.ServiceGrid>
    </M.ServiceSection>
  )
}

export default ServiceSection
