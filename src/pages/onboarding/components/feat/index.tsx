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
        title: '룸메이트 매칭 서비스',
        description: '성격 유형과 생활 습관을 분석해 나와 잘 맞는 룸메이트를 찾아보세요. 기숙사 생활의 질이 달라집니다.',
        image: '/matching1.png',
        bgColor: '#f8f4ff',
    },
    {
        id: 2,
        title: '성격 유형 분석',
        description: '다양한 질문을 통해 나의 성격 유형을 파악하고, 나와 잘 맞는 룸메이트 유형을 확인해보세요.',
        image: '/matching2.png',
        bgColor: '#fff4f4',
    },
    {
        id: 3,
        title: '상세 프로필 확인',
        description: '룸메이트 후보의 상세 프로필을 확인하고, 직접 연락해 더 깊은 대화를 나눠보세요.',
        image: '/matching3.png',
        bgColor: '#f4faff',
    },
    {
        id: 4,
        title: '매칭 시스템',
        description: '양방향 매칭 시스템으로 서로가 원할 때 연결됩니다. 안전하고 믿을 수 있는 매칭을 경험해보세요.',
        image: '/matching4.png',
        bgColor: '#f6fff4',
    },
]

const FeatureShowcase: React.FC = () => {
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
            '.feature-header',
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
            <Header className="feature-header">
                <Title>기숙사 생활이 더 편리해지는 기능들</Title>
                <Subtitle>
                    Dormworry가 제공하는 다양한 기능으로 기숙사 생활의 불편함을 해결하세요
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
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 40px;

  @media (max-width: 992px) {
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
  height: 260px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 200px;
  }
`

const FeatureImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${FeatureCard}:hover & {
    transform: scale(1.05);
  }
`

const CardContent = styled.div`
  padding: 24px;
  flex: 1;
`

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 12px;
  color: #333;
  font-weight: 600;
`

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.5;
`

export default FeatureShowcase 