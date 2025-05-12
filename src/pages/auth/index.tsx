import React, { useState } from 'react'
import styled from '@emotion/styled'
import authApi from '../../api/auth'
import Head from 'next/head'
import Image from 'next/image'
import { keyframes } from '@emotion/react'
import { useRecoilState } from 'recoil'
import { userAtom } from '../../recoil/atoms/userAtom'

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [, setUserState] = useRecoilState(userAtom)

  const handleKakaoLogin = () => {
    setIsLoading(true)
    // 로컬 스토리지에서 이전 상태 정보 제거
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')

    // 사용자 상태 초기화
    setUserState({
      isLoggedIn: false,
      isNewUser: false,
    })

    // 카카오 로그인 페이지로 리다이렉트
    const loginUrl = authApi.getKakaoLoginUrl()
    window.location.href = loginUrl
  }

  return (
    <>
      <Head>
        <title>DormWorry - 로그인</title>
        <meta
          name="description"
          content="대학생을 위한 기숙사 생활 정보 플랫폼"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <AuthCard>
          <LogoSection>
            <AppTitle>DormWorry</AppTitle>
            <AppSubtitle>기숙사 생활, 더 편리하게</AppSubtitle>
          </LogoSection>

          <WelcomeSection>
            <WelcomeText>환영합니다</WelcomeText>
            <WelcomeDesc>
              친구 찾기, 마음의 편지, 함께 배달주문 기능까지
              <br />
              기숙사 생활의 모든 것을 DormWorry에서 경험하세요.
            </WelcomeDesc>
          </WelcomeSection>

          <FeatureGrid>
            <FeatureItem>
              <FeatureIconWrapper color="#FFE0E0"></FeatureIconWrapper>
              <FeatureLabel>룸메이트</FeatureLabel>
            </FeatureItem>

            <FeatureItem>
              <FeatureIconWrapper color="#E0F0FF"></FeatureIconWrapper>
              <FeatureLabel>마음의 편지</FeatureLabel>
            </FeatureItem>

            <FeatureItem>
              <FeatureIconWrapper color="#E8F5E9"></FeatureIconWrapper>
              <FeatureLabel>배달 공동주문</FeatureLabel>
            </FeatureItem>
          </FeatureGrid>

          <KakaoLoginWrapper onClick={handleKakaoLogin} disabled={isLoading}>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <KakaoLoginImage
                src="/kakao_login_btn.png"
                alt="카카오 계정으로 로그인"
                width={300}
                height={45}
              />
            )}
          </KakaoLoginWrapper>

          <PolicyText>
            로그인 시 <PolicyLink href="#">이용약관</PolicyLink>과{' '}
            <PolicyLink href="#">개인정보처리방침</PolicyLink>에 동의하게 됩니다
          </PolicyText>
        </AuthCard>

        <ImageSection>
          <DormImage
            src="/banner.jpg"
            alt="기숙사 이미지"
            priority
            fill
            sizes="50vw"
            style={{ objectFit: 'cover' }}
          />
          <ImageOverlay />
          <ImageContent>
            <ImageTitle>편리한 기숙사 생활을 위한 최고의 선택</ImageTitle>
            <ImageDesc>
              DormWorry와 함께 더 즐거운 기숙사 생활을 시작해보세요
            </ImageDesc>
          </ImageContent>
        </ImageSection>
      </Container>
    </>
  )
}

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;

  @media (max-width: 992px) {
    flex-direction: column-reverse;
  }
`

const AuthCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.5rem;
  max-width: 500px;
  margin: 0 auto;

  @media (max-width: 992px) {
    max-width: 100%;
    padding: 2rem 1.5rem;
  }
`

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`

const LogoContainer = styled.div`
  margin-bottom: 1rem;
  animation: ${floatAnimation} 3s ease-in-out infinite;
`

const LogoImage = styled(Image)`
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`

const AppTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #90d1ca;
  margin: 0.5rem 0 0.25rem;
`

const AppSubtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
  font-weight: 500;
`

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

const WelcomeText = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.75rem;
`

const WelcomeDesc = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin: 0;
`

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 2rem 0;
`

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const FeatureIconWrapper = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${(props) => props.color};
  margin-bottom: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`

const FeatureIcon = styled(Image)`
  width: 24px;
  height: 24px;
`

const FeatureLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
`

const KakaoLoginWrapper = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 0;
  margin-top: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const KakaoLoginImage = styled(Image)`
  border-radius: 8px;
`

const KakaoIcon = styled(Image)`
  margin-right: 8px;
`

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 2px solid #000;
  animation: ${spinAnimation} 0.8s linear infinite;
`

const PolicyText = styled.p`
  font-size: 0.75rem;
  color: #999;
  text-align: center;
  margin-top: 1rem;
`

const PolicyLink = styled.a`
  color: #666;
  text-decoration: underline;

  &:hover {
    color: #333;
  }
`

const ImageSection = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;

  @media (max-width: 992px) {
    height: 240px;
  }
`

const DormImage = styled(Image)`
  object-position: center;
`

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.6)
  );
  z-index: 1;
`

const ImageContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 2rem;
  color: white;
  width: 100%;
`

const ImageTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 992px) {
    font-size: 1.5rem;
  }
`

const ImageDesc = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
  max-width: 90%;

  @media (max-width: 992px) {
    font-size: 0.875rem;
  }
`

export default AuthPage
