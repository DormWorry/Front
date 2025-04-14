import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { gsap } from 'gsap'

// 타입 정의
let ScrollTrigger: any

const FEATURES = [
  {
    id: 21,
    title: '편지 열람하기',
    description: '받은 편지함에서 나에게 도착한 편지를 확인하고 메시지를 읽어보세요.',
    image: '/letter1.gif',
    bgColor: '#fff0f5',

  },
  {
    id: 2,
    title: '익명으로 편지, 답장 작성하기',
    description: '익명으로 마음을 담은 편지를 작성해 보세요. 솔직한 감정과 생각을 전달할 수 있습니다.',
    image: '/letter2.gif',
    bgColor: '#f5f0ff',
  }

]

const LetterFeatureShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const featureRefs = FEATURES.map(() => useRef<HTMLDivElement>(null))

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return

    // GSAP ScrollTrigger 동적 로드
    const loadScrollTrigger = async () => {
      try {
        ScrollTrigger = (await import('gsap/ScrollTrigger')).ScrollTrigger
        gsap.registerPlugin(ScrollTrigger)

        initAnimations()
      } catch (error) {
        console.error('ScrollTrigger 로드 실패:', error)
      }
    }

    // 애니메이션 초기화 함수
    const initAnimations = () => {
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
        '.letter-feature-header',
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
    }

    loadScrollTrigger()

    return () => {
      // 컴포넌트 언마운트 시 ScrollTrigger 정리
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
      }
    }
  }, [])

  return (
    <Section ref={sectionRef}>
      <Header className="letter-feature-header">
        <Title>익명 편지로 마음을 전달해요</Title>
        <Subtitle>
          Dormworry의 편지 기능으로 기숙사 친구들에게 솔직한 마음을 전해보세요
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
  max-width: 900px;
  margin: 0 auto;

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
  height: 400px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  padding: 20px;

  @media (max-width: 1200px) {
    height: 380px;
  }

  @media (max-width: 992px) {
    height: 350px;
  }

  @media (max-width: 768px) {
    height: 320px;
    padding: 15px;
  }
`

const FeatureImage = styled.img`
  width: 110%;
  height: 110%;
  max-width: none;
  max-height: none;
  object-fit: contain;
  transform-origin: center;
  transition: transform 0.5s ease;
  image-rendering: -webkit-optimize-contrast; /* 크롬, 사파리 */
  image-rendering: crisp-edges; /* 파이어폭스 */
  
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

export default LetterFeatureShowcase 