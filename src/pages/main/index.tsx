import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useRecoilValue } from 'recoil'
import { userAtom } from '../../atoms/userAtom'
import * as M from './main-styles'
import { useWeather } from '@/hooks/main/useWeather'
import { useDateTime } from '@/hooks/main/useDateTime'
import Header from './components/Header'
import ServiceSection from './components/Services'
import MenuSection from './components/Menu'

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
const DEFAULT_COORDS = { lat: 37.5665, lon: 126.978 } // 서울 좌표 (기본값)

export default function Main() {
  const router = useRouter()
  // Recoil에서 사용자 정보 가져오기
  const user = useRecoilValue(userAtom)
  
  // 카카오 프로필 이미지 확인을 위한 useEffect
  useEffect(() => {
    // 한 번만 로그 출력
    console.log('사용자 정보 확인 (1회만 출력):', user)
    console.log('프로필 이미지 URL:', user?.profileImage)
    console.log('사용자 객체 전체 내용:', JSON.stringify(user, null, 2))
  }, []) // 빈 의존성 배열로 마운트 시에만 실행

  // 날짜/시간 정보 가져오기 (useDateTime 훅 사용)
  const { currentTime, currentDate } = useDateTime()

  // 날씨 정보 가져오기 (useWeather 훅 사용)
  const weather = useWeather(DEFAULT_COORDS, WEATHER_API_KEY)
  
  // 로그인 상태 확인
  useEffect(() => {
    // 로그인되어 있지 않으면 로그인 페이지로 리디렉션
    if (!user.isLoggedIn) {
      router.push('/auth')
    }
  }, [user, router])

  return (
    <>
      <Head>
        <title>기숙사 생활 도우미</title>
        <meta
          name="description"
          content="기숙사 생활을 더 편리하게 만들어주는 서비스"
        />
      </Head>
      <M.Container>
        {/* 헤더 섹션 */}
        <Header
          user={user}
          weather={weather}
          currentTime={currentTime}
          currentDate={currentDate}
        />

        <M.MainContent>
          {/* 서비스 섹션 */}
          <ServiceSection />

          {/* 오늘의 식단 섹션 */}
          <MenuSection />
        </M.MainContent>
      </M.Container>
    </>
  )
}
