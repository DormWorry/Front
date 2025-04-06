import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// GSAP 플러그인 등록
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const FEATURES = [
    {
        id: 1,
        title: '배달 주문하기',
        description: '기숙사 친구들과 함께 배달 음식을 모아서 주문해보세요. 배달비를 절약할 수 있습니다.',
        image: '/order1.gif',
        bgColor: '#f0f8ff',
    },
    {
        id: 2,
        title: '배달 참여하기',
        description: '다른 사람이 열어둔 배달 파티에 참여하여 배달비를 나눠 부담해보세요.',
        image: '/order2.gif',
        bgColor: '#fff5f0',
    },
    {
        id: 3,
        title: '채팅으로 소통하기',
        description: '실시간 채팅으로 메뉴와 금액을 조율하고 편리하게 소통해보세요.',
        image: '/order3.gif',
        bgColor: '#f0fff5',
    },
]

const DeliveryFeatureShowcase: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null)
    const featureRefs = FEATURES.map(() => useRef<HTMLDivElement>(null))

    useEffect(() => {
        if (typeof window === 'undefined') return

        // 각 피쳐 아이템에 애니메이션 적용
        featureRefs.forEach((ref, index) => {
            if (!ref.current) return

            gsap.fromTo(
                ref.current,
                {
                    y: 50,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                }
            )
        })

        // 헤더 애니메이션
        gsap.fromTo(
            '.delivery-feature-header',
            { y: -30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none none',
                },
            }
        )

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [])

    return (
        <Section ref={sectionRef}>
            <Header className="delivery-feature-header">
                <Title>함께하는 배달, 더 저렴하게</Title>
                <Subtitle>
                    Dormworry의 배달 기능으로 기숙사 친구들과 함께 배달비를 절약하세요
                </Subtitle>
            </Header>

            <FeaturesGrid>
                {FEATURES.map((feature, index) => (
                    <FeatureCard
                        key={feature.id}
                        ref={featureRefs[index]}
                        bgColor={feature.bgColor}
                    >
                        <ImageContainer>
                            <FeatureImage src={feature.image} alt={feature.title} />
                        </ImageContainer>
                        <CardContent>
                            <FeatureTitle>{feature.title}</FeatureTitle>
                            <FeatureDescription>{feature.description}</FeatureDescription>
                        </CardContent>
                    </FeatureCard>
                ))}
            </FeaturesGrid>
        </Section>
    )
}

// 스타일드 컴포넌트
const Section = styled.div`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 60px 16px;
  }
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: #333;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 30px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 30px;
  }
`

const FeatureCard = styled.div<{ bgColor: string }>`
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: ${props => props.bgColor || '#fff'};

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  }
`

const ImageContainer = styled.div`
  width: 100%;
  height: 350px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;

  @media (max-width: 1200px) {
    height: 300px;
  }

  @media (max-width: 768px) {
    height: 280px;
  }
`

const FeatureImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: transform 0.5s ease;
  
  ${FeatureCard}:hover & {
    transform: scale(1.03);
  }
`

const CardContent = styled.div`
  padding: 16px;
  flex: 1;
`

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
`

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  color: #555;
  line-height: 1.5;
`

export default DeliveryFeatureShowcase 