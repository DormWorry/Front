import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function KakaoCallbackPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!router.isReady) return

        // 이 페이지는 백엔드의 콜백 처리 후 리다이렉트되어 
        // 사용되지 않을 수 있지만, 에러 처리 목적으로 유지
        const { error: kakaoError } = router.query

        if (kakaoError) {
            setError('카카오 로그인이 취소되었습니다.')
            setIsLoading(false)
            return
        }

        // 일정 시간 후 홈페이지로 리다이렉트
        setTimeout(() => {
            router.push('/login')
        }, 3000)

        setIsLoading(false)
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
                    <h2>카카오 인증 완료</h2>
                    <p>로그인 처리 중입니다...</p>
                </>
            )}
        </div>
    )
} 