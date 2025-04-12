import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import * as M from './main-styles'
import { useWeather } from '@/hooks/main/useWeather'
import { useDateTime } from '@/hooks/main/useDateTime'
import Header from './components/Header'
import ServiceSection from './components/Services'
import MenuSection from './components/Menu'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@/recoil/atoms/userAtom'
import { useRouter } from 'next/router'

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
const DEFAULT_COORDS = { lat: 37.5665, lon: 126.978 } // 서울 좌표 (기본값)

export default function Main() {
  // 실제 사용자 정보 가져오기
  const userState = useRecoilValue(userAtom)
  const router = useRouter()

  // 날짜/시간 정보 가져오기
  const { currentTime, currentDate } = useDateTime()

  // 날씨 정보 가져오기
  const weather = useWeather(DEFAULT_COORDS, WEATHER_API_KEY)

  // 사용자 정보 설정
  const user = {
    name: userState.nickname || '사용자',
    profileImage: '/default-profile.png',
    dormitory: `${userState.dormitoryId || ''}기숙사`,
    room: userState.roomNumber || '',
  }

  // 로그인 체크
  useEffect(() => {
    if (!userState.isLoggedIn) {
      router.push('/auth')
    }
  }, [userState.isLoggedIn, router])

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
