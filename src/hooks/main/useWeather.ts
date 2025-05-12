import { useState, useEffect } from 'react'
import { convertToGrid, getFormattedDate, weatherIcons, getWeatherDescriptionByCode } from '@/utils/weather'

export interface Coordinates {
  lat: number
  lon: number
}

export interface WeatherData {
  temp: number
  description: string
  main: string
  icon: string
  city: string
  loading: boolean
  error: string | null
}

export function useWeather(defaultCoords: Coordinates, apiKey: string | undefined): WeatherData {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 0,
    description: '',
    main: '',
    icon: '',
    city: '',
    loading: true,
    error: null,
  })

  useEffect(() => {
    // 날씨 정보 가져오기
    const fetchWeatherData = async (lat: number, lon: number) => {
      // API 키가 없으면 일찍 종료하고 오류 표시
      if (!apiKey) {
        console.error('날씨 API 키가 설정되지 않았습니다.')
        setWeather(prev => ({
          ...prev,
          loading: false,
          error: 'API 키가 설정되지 않았습니다.',
          description: '날씨 정보를 불러올 수 없습니다',
          icon: '⚠️',
        }))
        return
      }
      try {
        setWeather((prev) => ({ ...prev, loading: true, error: null }))

        // 위경도를 기상청 XY 격자 좌표로 변환
        const grid = convertToGrid(lat, lon)

        // 날짜 및 시간 정보 가져오기
        const { baseDate, baseTime } = getFormattedDate()
        
        // 기상청 단기예보 API 호출 (HTTPS 사용)
        const encodedKey = apiKey.includes('%') ? apiKey : encodeURIComponent(apiKey);
        const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${encodedKey}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${grid.nx}&ny=${grid.ny}`

        console.log('날씨 API 요청 시도:', baseDate, baseTime);
        
        const response = await fetch(url);
        
        // 응답 형식 확인
        const contentType = response.headers.get('content-type');
        
        if (!response.ok) {
          console.error(`날씨 API 오류 (${response.status}): ${response.statusText}`);
          throw new Error('날씨 정보를 가져오는데 실패했습니다.');
        }
        
        // 응답이 JSON인지 확인
        if (contentType && !contentType.includes('application/json')) {
          const errorText = await response.text();
          console.error('응답이 JSON 형식이 아님:', errorText);
          throw new Error('받은 응답이 JSON 형식이 아닙니다');
        }
        
        const data = await response.json();

        if (data.response.header.resultCode !== '00') {
          throw new Error(
            data.response.header.resultMsg ||
              '날씨 정보를 가져오는데 실패했습니다.'
          );
        }

        // 기상청 API 응답에서 필요한 데이터 추출
        const items = data.response.body.items.item
        let temperature = 0
        let ptyCode = '0' // 강수형태 코드

        items.forEach((item: { category: string; obsrValue: string }) => {
          if (item.category === 'T1H') {
            // 기온
            temperature = parseFloat(item.obsrValue)
          } else if (item.category === 'PTY') {
            // 강수형태
            ptyCode = item.obsrValue
          }
        })

        // 강수형태 코드에 따른 날씨 설명
        const weatherDescription = getWeatherDescriptionByCode(ptyCode)

        // 도시 이름 찾기 (실제 앱에서는 위경도->주소 변환 API를 사용하는 것이 좋습니다)
        let cityName = '서울'
        if (Math.abs(lat - 37.5665) > 0.1 || Math.abs(lon - 126.978) > 0.1) {
          cityName = '현재 위치'
        }

        setWeather({
          temp: Math.round(temperature),
          description: weatherDescription,
          main: weatherDescription,
          icon: weatherIcons[weatherDescription] || '🌈',
          city: cityName,
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error('날씨 정보 가져오기 오류:', error)
        setWeather((prev) => ({
          ...prev,
          loading: false,
          error: '날씨 정보를 가져오는데 실패했습니다.',
        }))
      }
    }

    // 지리적 위치 가져오기
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherData(
              position.coords.latitude,
              position.coords.longitude,
            )
          },
          (error) => {
            console.error('위치 정보 가져오기 오류:', error)
            // 위치 정보를 가져올 수 없는 경우 기본 좌표(서울) 사용
            fetchWeatherData(defaultCoords.lat, defaultCoords.lon)
          },
        )
      } else {
        console.error('이 브라우저는 위치 정보를 지원하지 않습니다.')
        // 위치 정보를 지원하지 않는 경우 기본 좌표(서울) 사용
        fetchWeatherData(defaultCoords.lat, defaultCoords.lon)
      }
    }

    getLocation()
  }, [defaultCoords, apiKey])

  return weather
}
