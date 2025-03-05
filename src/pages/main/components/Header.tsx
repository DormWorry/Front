import React from 'react'
import * as M from '../main-styles'
import { WeatherData } from '@/hooks/main/useWeather'

interface User {
  name: string
  profileImage: string
  dormitory: string
  room: string
}

interface HeaderProps {
  user: User
  weather: WeatherData
  currentTime: string
  currentDate: string
}

const Header: React.FC<HeaderProps> = ({
  user,
  weather,
  currentTime,
  currentDate,
}) => {
  return (
    <M.Header>
      <M.WelcomeSection>
        <M.ProfileAndGreeting>
          <M.ProfileImageWrapper>
            <M.ProfileImage src={user.profileImage} alt="프로필 이미지" />
          </M.ProfileImageWrapper>
          <M.Greeting>
            <M.WelcomeText>
              안녕하세요, <M.UserName>{user.name}</M.UserName>님!
            </M.WelcomeText>
            <M.UserLocation>
              {user.dormitory} {user.room}
            </M.UserLocation>
          </M.Greeting>
        </M.ProfileAndGreeting>

        <M.TimeAndWeather>
          <M.TimeSection>
            <M.TimeDisplay>{currentTime}</M.TimeDisplay>
            <M.DateDisplay>{currentDate}</M.DateDisplay>
          </M.TimeSection>

          <M.WeatherWidget>
            {weather.loading ? (
              <M.WeatherLoading>날씨 정보 로딩 중...</M.WeatherLoading>
            ) : weather.error ? (
              <M.WeatherError>{weather.error}</M.WeatherError>
            ) : (
              <>
                <M.WeatherIcon>{weather.icon}</M.WeatherIcon>
                <M.WeatherInfo>
                  <M.WeatherTemp>{weather.temp}°C</M.WeatherTemp>
                  <M.WeatherDesc>{weather.description}</M.WeatherDesc>
                  <M.WeatherCity>{weather.city}</M.WeatherCity>
                </M.WeatherInfo>
              </>
            )}
          </M.WeatherWidget>
        </M.TimeAndWeather>
      </M.WelcomeSection>
    </M.Header>
  )
}

export default Header
