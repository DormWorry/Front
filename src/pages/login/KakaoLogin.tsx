import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
    LoginContainer,
    LoginCard,
    Logo,
    Subtitle,
    SocialButtonContainer,
    KakaoButton,
} from './styles'

const KakaoLogin: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)

    // 카카오 로그인에 필요한 상수 정의
    const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '카카오_앱_키를_입력하세요'
    const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || 'http://localhost:3000/auth/kakao/callback'

    useEffect(() => {
        // 카카오 SDK 스크립트 로드
        const script = document.createElement('script')
        script.src = 'https://developers.kakao.com/sdk/js/kakao.js'
        script.async = true

        script.onload = () => {
            window.Kakao.init(KAKAO_CLIENT_ID)
            console.log('카카오 SDK 로드 완료', window.Kakao.isInitialized())
        }

        document.head.appendChild(script)

        return () => {
            document.head.removeChild(script)
        }
    }, [])

    // 카카오 로그인 처리 함수
    const handleKakaoLogin = () => {
        setIsLoading(true)

        try {
            // 카카오 로그인 페이지로 리다이렉트
            window.Kakao.Auth.authorize({
                redirectUri: KAKAO_REDIRECT_URI,
                throughTalk: true, // 카카오톡 앱을 통한 로그인 허용
            })
        } catch (error) {
            console.error('카카오 로그인 에러:', error)
            setIsLoading(false)
        }
    }

    return (
        <LoginContainer>
            <LoginCard>
                <Logo src="/logo.png" alt="로고" />
                <SocialButtonContainer>
                    <Subtitle>카카오 계정으로 간편하게 로그인하고<br /> 기숙사 삶의 질을 높여보세요!</Subtitle>

                    <KakaoButton onClick={handleKakaoLogin} disabled={isLoading}>
                        <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M9 0.5C4.0294 0.5 0 3.68345 0 7.58953C0 10.0655 1.55535 12.2393 3.93306 13.5114C3.75113 14.1755 3.31753 15.9682 3.2182 16.3083C3.09267 16.7259 3.37733 16.7207 3.58767 16.5836C3.75347 16.4747 5.9412 14.9958 6.88767 14.3578C7.57807 14.4626 8.284 14.5202 9 14.5202C13.9706 14.5202 18 11.3367 18 7.43071C18 3.52468 13.9706 0.5 9 0.5Z" fill="currentColor" />
                        </svg>
                        {isLoading ? '로그인 중...' : '카카오 계정으로 로그인'}
                    </KakaoButton>
                </SocialButtonContainer>
            </LoginCard>
        </LoginContainer>
    )
}

// 타입 정의 추가
declare global {
    interface Window {
        Kakao: any;
    }
}

export default KakaoLogin 