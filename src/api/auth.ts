import axios from 'axios'
// 백엔드 API URL 설정
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://port-0-capstoneserver-m6xxoqjg3249c6c2.sel4.cloudtype.app'

// 백엔드 서버가 정상 작동하는지 확인
console.log('Backend API URL:', API_BASE_URL)

// 프론트엔드 URL 설정
const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://capstone-front-nu.vercel.app'

// 사용자 프로필 타입 정의
export type UserProfile = {
  nickname: string
  studentId: string
  department: string
  dormitoryId: number
  roomNumber: string
  gender: string
  isNewUser?: boolean
  kakaoId?: string
  email?: string
};

const authApi = {
  // 카카오 로그인 URL 가져오기
  getKakaoLoginUrl: () => {
    const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
    // 프론트엔드 콜백 URL 사용
    const REDIRECT_URI = `${FRONTEND_URL}/auth/callback`
    return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`
  },

  // 인증 코드를 토큰으로 교환
  exchangeCodeForToken: async (code: string) => {
    try {
      console.log('Sending code to backend:', code.substring(0, 10) + '...') // 일부만 표시
      console.log('API URL:', `${API_BASE_URL}/auth/kakao/token`)
      console.log('Origin:', window.location.origin)
      
      // CORS 오류 방지를 위한 설정
      const response = await axios.post(
        `${API_BASE_URL}/auth/kakao/token`,
        { code, redirectUri: `${window.location.origin}/auth/callback` },
        {
          withCredentials: true, // 쿠키 포함 전송
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          // withCredentials 사용 시 CORS 오류 발생하여 제거
        },
      )

      console.log('Backend response:', response.data) // 디버깅용

      // 백엔드 응답 형식에 맞게 수정
      if (
        response.data &&
        response.data.data &&
        response.data.data.accessToken
      ) {
        return response.data.data.accessToken
      } else {
        throw new Error('토큰 응답 형식이 올바르지 않습니다')
      }
    } catch (error) {
      console.error('토큰 교환 실패:', error)
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data)
        console.error('Error status:', error.response?.status)
      }
      throw error
    }
  },

  // 카카오 로그인 상태 확인
  checkLoginStatus: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      return { isLoggedIn: false, user: null }
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/kakao/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return {
        isLoggedIn: true,
        user: response.data.user,
      }
    } catch (error) {
      console.error('로그인 상태 확인 오류:', error)
      // 토큰이 유효하지 않으면 제거
      localStorage.removeItem('token')
      return { isLoggedIn: false, user: null }
    }
  },

  // 사용자 프로필 업데이트 (신규 회원가입 시)
  updateUserProfile: async (profileData: UserProfile) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.')
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/profile/create`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error) {
      console.error('프로필 업데이트 오류:', error)
      throw error
    }
  },

  // 현재 로그인한 사용자 정보 조회
  getCurrentUser: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      return null
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        response.data.data.user
      ) {
        return response.data.data.user
      }

      return null
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error)
      localStorage.removeItem('token')
      return null
    }
  },

  // 로그아웃
  logout: () => {
    localStorage.removeItem('token')
    // 로그아웃 후 홈페이지로 리디렉션
    window.location.href = '/'
  },
}

export default authApi
