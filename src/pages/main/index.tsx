import React, { useState } from 'react'
import Head from 'next/head'
import { mockUser } from '@/api/mockUser'
import * as M from './main-styles'
import { useWeather } from '@/hooks/main/useWeather'
import { useDateTime } from '@/hooks/main/useDateTime'
import Header from './components/Header'
import ServiceSection from './components/Services'
import MenuSection from './components/Menu'

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
const DEFAULT_COORDS = { lat: 37.5665, lon: 126.978 } // 서울 좌표 (기본값)

export default function Main() {
  // 사용자 정보(임시)
  const [user] = useState(mockUser)

  // 날짜/시간 정보 가져오기 (useDateTime 훅 사용)
  const { currentTime, currentDate } = useDateTime()

  // 날씨 정보 가져오기 (useWeather 훅 사용)
  const weather = useWeather(DEFAULT_COORDS, WEATHER_API_KEY)

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
