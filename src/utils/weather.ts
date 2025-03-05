// 위경도를 기상청 XY 격자 좌표로 변환
export function convertToGrid(lat: number, lon: number) {
  const RE = 6371.00877 // 지구 반경(km)
  const GRID = 5.0 // 격자 간격(km)
  const SLAT1 = 30.0 // 투영 위도1(degree)
  const SLAT2 = 60.0 // 투영 위도2(degree)
  const OLON = 126.0 // 기준점 경도(degree)
  const OLAT = 38.0 // 기준점 위도(degree)
  const XO = 43 // 기준점 X좌표(GRID)
  const YO = 136 // 기준점 Y좌표(GRID)

  const DEGRAD = Math.PI / 180.0
  const re = RE / GRID
  const slat1 = SLAT1 * DEGRAD
  const slat2 = SLAT2 * DEGRAD
  const olon = OLON * DEGRAD
  const olat = OLAT * DEGRAD

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5)
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn)
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5)
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5)
  ro = (re * sf) / Math.pow(ro, sn)

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5)
  ra = (re * sf) / Math.pow(ra, sn)
  let theta = lon * DEGRAD - olon
  if (theta > Math.PI) theta -= 2.0 * Math.PI
  if (theta < -Math.PI) theta += 2.0 * Math.PI
  theta *= sn

  const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5)
  const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5)

  return { nx, ny }
}

// 기상청 API에서 사용하는 시간 형식으로 변환
export function getFormattedDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const date = String(now.getDate()).padStart(2, '0')

  const hours = now.getHours()
  // 기상청 API는 3시간 단위로 데이터 제공 (02:00, 05:00, 08:00, 11:00, 14:00, 17:00, 20:00, 23:00)
  // 가장 가까운 이전 시간대 계산
  const baseHours = hours - (hours % 3)
  const formattedHours = String(baseHours).padStart(2, '0')

  return {
    baseDate: `${year}${month}${date}`,
    baseTime: `${formattedHours}00`,
  }
}

// 날씨 아이콘 매핑 (기상청 날씨 코드 기준)
export const weatherIcons: Record<string, string> = {
  맑음: '☀️',
  구름조금: '🌤️',
  구름많음: '⛅',
  흐림: '☁️',
  비: '🌧️',
  '비/눈': '🌨️',
  눈: '❄️',
  소나기: '🌦️',
  천둥번개: '⛈️',
  안개: '🌫️',
  황사: '😷',
  눈날림: '🌨️',
}

// 날씨 코드에 따른 설명 반환
export function getWeatherDescriptionByCode(ptyCode: string): string {
  switch (ptyCode) {
    case '1':
      return '비'
    case '2':
      return '비/눈'
    case '3':
      return '눈'
    case '4':
      return '소나기'
    default:
      return '맑음'
  }
}
