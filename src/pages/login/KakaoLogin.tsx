import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {
    LoginContainer,
    LoginCard,
    Logo,
    Title,
    Subtitle,
    SocialButtonContainer,
    KakaoButton,

} from './styles'

const KakaoLogin: React.FC = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // 카카오 로그인 처리 함수
    const handleKakaoLogin = async () => {
        setIsLoading(true)
        try {
            // 실제 구현에서는 카카오 SDK를 사용하여 로그인 처리
            // Kakao.Auth.authorize({...})
            window.location.href = 'https://kauth.kakao.com/oauth/authorize?client_id=YOUR_KAKAO_APP_KEY&redirect_uri=YOUR_REDIRECT_URI&response_type=code'
        } catch (error) {
            console.error('카카오 로그인 에러:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // 일반 로그인 처리 함수
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // 로그인 API 호출 (구현 필요)
            // const response = await loginApi(email, password);

            // 성공 시 홈 페이지로 리다이렉트
            setTimeout(() => {
                router.push('/')
            }, 1000)
        } catch (error) {
            console.error('로그인 에러:', error)
            alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
        } finally {
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
                        카카오 계정으로 로그인
                    </KakaoButton>


                </SocialButtonContainer>

            </LoginCard>
        </LoginContainer>
    )
}

export default KakaoLogin 