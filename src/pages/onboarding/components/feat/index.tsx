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
    title: '유형 카드 선택',
    description: '본인 성격 유형과 원하는 상대 유형을 선택해보세요.',
    image: '/matching1.gif',
    bgColor: '#f8f4ff',
  },
  {
    id: 3,
    title: '프로필 작성',
    description: '본인의 정보를 입력하여 프로필을 작성해보세요',
    image: '/matching3.png',
    bgColor: '#f4faff',
  },
  {
    id: 4,
    title: '원하는 룸메 찾기',
    description: '카드를 넘기면서 본인이 원하는 상대를 찾아보세요',
    image: '/matching4.gif',
    bgColor: '#f6fff4',
  },
]

const FeatureShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  // 각 기능에 대한 참조 배열 미리 생성
  const featureRefs = FEATURES.map(() => React.createRef<HTMLDivElement>())

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 각 피쳐 아이템에 애니메이션 적용
    featureRefs.forEach((ref) => {
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
        <Title>룸메이트 혹은 친구 매칭 서비스</Title>
        <Subtitle>
          Dormworry가 제공하는 매칭 기능으로 자신의 친구를 찾아보세요!
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
  height: 300px;
  overflow: hidden;

  @media (max-width: 1200px) {
    height: 260px;
  }

  @media (max-width: 768px) {
    height: 240px;
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

export default FeatureShowcase 