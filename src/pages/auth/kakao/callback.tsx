import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function KakaoCallbackPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // 인증 코드를 백엔드로 전송하는 함수
    const processKakaoCode = async (code: string) => {
        try {
            // 백엔드 API로 인증 코드 전송
            const response = await fetch('/api/auth/kakao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || '로그인 처리 중 오류가 발생했습니다')
            }

            const data = await response.json()

            // 사용자 정보와 토큰 저장
            localStorage.setItem('accessToken', data.accessToken)

            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user))
            }

            // 로그인 성공 처리
            setIsLoading(false)

            // 사용자 프로필 정보가 있는지 확인
            const hasProfile = data.user && data.user.hasProfile

            // 프로필이 있으면 메인으로, 없으면 프로필 작성 페이지로 이동
            setTimeout(() => {
                router.push(hasProfile ? '/' : '/matching')
            }, 1500)

            return true
        } catch (error: any) {
            console.error('카카오 로그인 처리 오류:', error)
            setError(error.message || '로그인 처리 중 오류가 발생했습니다')
            setIsLoading(false)
            return false
        }
    }

    useEffect(() => {
        if (!router.isReady) return

        const { code, error: kakaoError } = router.query

        if (kakaoError) {
            setError('카카오 로그인이 취소되었습니다.')
            setIsLoading(false)
            return
        }

        if (code) {
            // 인증 코드를 백엔드로 전송하여 처리
            processKakaoCode(code as string)
        }
    }, [router.isReady, router.query])

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            padding: '20px',
            textAlign: 'center'
        }}>
            {isLoading ? (
                <>
                    <h2>카카오 로그인 처리 중...</h2>
                    <p>잠시만 기다려주세요.</p>
                </>
            ) : error ? (
                <>
                    <h2>로그인 오류</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => router.push('/login')}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#fee500',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        로그인 페이지로 돌아가기
                    </button>
                </>
            ) : (
                <>
                    <h2>로그인 성공!</h2>
                    <p>페이지로 이동합니다...</p>
                </>
            )}
        </div>
    )
} 