import { useState, useEffect } from 'react'

export interface DateTimeState {
  currentTime: string
  currentDate: string
}

export function useDateTime(): DateTimeState {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  // 현재 시간 및 날짜 업데이트 (1초마다)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()

      // 시간 포맷: 오전/오후 시:분:초
      const hours = now.getHours()
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const seconds = now.getSeconds().toString().padStart(2, '0')
      const ampm = hours >= 12 ? '오후' : '오전'
      const formattedHours = hours % 12 || 12 // 12시간제 변환 (0은 12로)

      setCurrentTime(`${ampm} ${formattedHours}:${minutes}:${seconds}`)

      // 날짜 포맷: 2025년 2월 28일 목요일
      const days = ['일', '월', '화', '수', '목', '금', '토']
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const date = now.getDate()
      const day = days[now.getDay()]
      setCurrentDate(`${year}년 ${month}월 ${date}일 ${day}요일`)
    }

    updateTime() // 초기 로드 시 한 번 실행
    const interval = setInterval(updateTime, 1000) // 1초마다 업데이트

    return () => clearInterval(interval)
  }, [])

  return { currentTime, currentDate }
}
