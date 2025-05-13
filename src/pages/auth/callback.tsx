import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { useSetRecoilState } from 'recoil'
import { userAtom } from '@/atoms/userAtom'
import authApi from '@/api/auth' // Import the authApi module
import SignupModal from '@/components/auth/SignupModal'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`

const LoadingBox = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 450px;
  width: 90%;
`

const LoadingTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-top: 10px;
`

const LoadingAnimation = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3396f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background: #3396f4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #2a7fd4;
  }
`

const KakaoCallbackPage = () => {
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState<boolean>(true)
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false)
  const [kakaoId, setKakaoId] = useState<string>('')
  const setUser = useSetRecoilState(userAtom)
  const router = useRouter()

  const handleKakaoCallback = useCallback(
    async (code: string) => {
      try {
        // 인증 코드를 사용하여 토큰을 요청
        const token = await authApi.exchangeCodeForToken(code)

        if (token) {
          // 토큰을 로컬 스토리지에 저장
          localStorage.setItem('token', token)

          // 사용자 정보 조회
          const user = await authApi.getCurrentUser()

          if (user) {
            // Recoil 상태 업데이트 - 토큰도 함께 저장
            setUser({
              ...user,
              token: token, // 토큰 저장
              isLoggedIn: true
            })

            // 신규 사용자 여부 확인
            if (user.isNewUser) {
              // 신규 사용자인 경우 회원가입 모달 표시
              setKakaoId(user.kakaoId || '')
              setShowSignupModal(true)
              setProcessing(false)
            } else {
              // 기존 사용자는 메인 페이지로 리다이렉트
              router.push('/main')
            }
          } else {
            setError('사용자 정보를 불러오는데 실패했습니다.')
            setProcessing(false)
          }
        } else {
          setError('인증 토큰을 받지 못했습니다.')
          setProcessing(false)
        }
      } catch (error: unknown) {
        console.error('로그인 처리 실패:', error)
        const errorMessage =
          error instanceof Error
            ? error.message
            : '인증 처리 중 오류가 발생했습니다.'
        setError(errorMessage)
        setProcessing(false)
      }
    },
    [router, setUser],
  )

  useEffect(() => {
    // URL에서 인증 코드 가져오기
    if (router.isReady) {
      const { code } = router.query

      if (code && typeof code === 'string') {
        handleKakaoCallback(code)
      } else {
        setError('인증 코드를 받지 못했습니다.')
        setProcessing(false)
      }
    }
  }, [router.isReady, router.query, handleKakaoCallback])

  // 회원가입 모달 닫기 처리
  const handleCloseSignupModal = () => {
    setShowSignupModal(false)
    // 모달을 닫으면 홈페이지로 리디렉션 (취소한 경우)
    router.push('/')
  }
  
  return (
    <Container>
      {/* 회원가입 모달 */}
      <SignupModal 
        isOpen={showSignupModal} 
        onClose={handleCloseSignupModal} 
        kakaoId={kakaoId} 
      />
      
      {/* 로딩 또는 에러 표시 */}
      {!showSignupModal && (
        <LoadingBox>
          {error ? (
            <>
              <LoadingTitle>로그인 오류</LoadingTitle>
              <ErrorMessage>{error}</ErrorMessage>
              <Button onClick={() => router.push('/')}>홈으로 돌아가기</Button>
            </>
          ) : (
            <>
              <LoadingTitle>
                {processing ? '로그인 처리 중...' : '로그인 완료!'}
              </LoadingTitle>
              {processing && <LoadingAnimation />}
              <p>
                {processing
                  ? '잠시만 기다려 주세요.'
                  : '메인 페이지로 이동합니다.'}
              </p>
            </>
          )}
        </LoadingBox>
      )}
    </Container>
  )
}

export default KakaoCallbackPage
