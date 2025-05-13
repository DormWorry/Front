import axios from 'axios'

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://port-0-capstoneserver-m6xxoqjg3249c6c2.sel4.cloudtype.app'

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // withCredentials 제거 - CORS 오류 해결
  // withCredentials: true,  // 쿠키, 인증 헤더 포함 전송 설정
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: 로컬 스토리지에서 토큰을 가져와 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터: 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 에러 (인증 실패) 처리
    if (error.response && error.response.status === 401) {
      // 로그아웃 처리 로직 추가 가능
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
