import React from 'react'
import * as M from '../main-styles'
import { WeatherData } from '@/hooks/main/useWeather'
import { UserState } from '../../../atoms/userAtom'

// 사용자 타입 (UserState를 확장해서 사용)

interface HeaderProps {
  user: UserState
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
            <M.ProfileImage 
              src={user?.profileImage || '/user.png'} 
              alt="프로필 이미지" 
              onError={(e) => {
                // 이미지 로드 오류 시 기본 이미지로 대체
                e.currentTarget.src = '/user.png';
              }}
            />
          </M.ProfileImageWrapper>
          <M.Greeting>
            <M.WelcomeText>
              안녕하세요, <M.UserName>{user?.nickname || '회원'}</M.UserName>님!
            </M.WelcomeText>
            <M.UserLocation>
              기숙사 {user?.dormitoryId || '-'}호 {user?.roomNumber || '-'}번 방
            </M.UserLocation>
          </M.Greeting>
        </M.ProfileAndGreeting>

        <M.TimeAndWeather>
          <M.TimeSection>
            <M.TimeDisplay>{currentTime}</M.TimeDisplay>
            <M.DateDisplay>{currentDate}</M.DateDisplay>
          </M.TimeSection>

          <M.WeatherWidget>
            {weather?.loading ? (
              <M.WeatherLoading>날씨 정보 로딩 중...</M.WeatherLoading>
            ) : weather?.error ? (
              <M.WeatherError>{weather?.error}</M.WeatherError>
            ) : (
              <>
                <M.WeatherIcon>
                  {weather?.icon && (
                    <img
                      src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                      alt={weather?.description || '날씨 아이콘'}
                    />
                  )}
                </M.WeatherIcon>
                <M.WeatherInfo>
                  <M.WeatherTemp>{weather?.temp || '-'}°C</M.WeatherTemp>
                  <M.WeatherDesc>{weather?.description || '날씨 정보 없음'}</M.WeatherDesc>
                  <M.WeatherCity>{weather?.city || '-'}</M.WeatherCity>
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
