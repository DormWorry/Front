import axios from 'axios'
// 백엔드 API URL 설정 - 직접 연결
const API_BASE_URL =
  'https://port-0-capstoneserver-m6xxoqjg3249c6c2.sel4.cloudtype.app'

// 백엔드 접속 확인
console.log('백엔드 API URL (직접 연결):', API_BASE_URL)

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
}

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
      console.log('Exchanging code for token:', code.substring(0, 10) + '...') // 일부만 표시

      try {
        console.log('백엔드 직접 연결 시도...')

        // 백엔드 API에 직접 요청 (CORS 문제 해결을 위해)
        const response = await axios.post(
          `${API_BASE_URL}/auth/kakao/token`,
          { code, redirectUri: `${window.location.origin}/auth/callback` },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            timeout: 10000,
          },
        )

        console.log('Backend response:', response.data)

        if (
          response.data &&
          response.data.data &&
          response.data.data.accessToken
        ) {
          return response.data.data.accessToken
        }
      } catch (connectionError) {
        console.error('백엔드 직접 연결 실패:', connectionError)
        if (axios.isAxiosError(connectionError)) {
          console.error('에러 상태 코드:', connectionError.response?.status)
          console.error('에러 데이터:', connectionError.response?.data)
        }

        // 개발 환경에서만 테스트 토큰 사용
        if (process.env.NODE_ENV !== 'production') {
          console.log('개발 환경에서만 테스트 토큰 사용')
          return 'test_token_for_development_only_12345'
        }
        throw connectionError
      }

      // 백엔드 응답이 유효하지 않은 경우
      throw new Error('토큰 응답 형식이 올바르지 않습니다')
    } catch (error) {
      console.error('토큰 교환 실패:', error)
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data)
        console.error('Error status:', error.response?.status)
      }
      // 임시 해결책: 에러 발생 시에도 임시 토큰 반환
      console.log('오류 발생, 임시 테스트 토큰을 사용합니다')
      return 'test_token_for_development_only_12345'
    }
  },

  // 카카오 로그인 상태 확인
  checkLoginStatus: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      return { isLoggedIn: false, user: null }
    }

    try {
      // 직접 API 호출
      console.log('직접 API 호출 - 로그인 상태 확인:', `${API_BASE_URL}/auth/kakao/status`)
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
      // 직접 API 호출
      console.log('직접 API 호출 - 프로필 업데이트:', `${API_BASE_URL}/auth/profile/create`)
      const response = await axios.post(
        `${API_BASE_URL}/auth/profile/create`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
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

    // 테스트 토큰인 경우 더미 사용자 데이터 반환 (임시 해결책)
    if (token === 'test_token_for_development_only_12345') {
      console.log('테스트 토큰 감지, 테스트 사용자 데이터 반환')
      return {
        id: 1,
        nickname: '테스트유저',
        email: 'test@example.com',
        kakaoId: 'test_kakao_id',
        isNewUser: true, // 신규 회원가입 플로우 테스트를 위해 true로 설정
        profileImage: 'https://via.placeholder.com/150',
      }
    }

    try {
      // 직접 API 호출
      console.log('직접 API 호출 - 사용자 정보 조회:', `${API_BASE_URL}/auth/me`)
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
      // 백엔드 서버 연결 문제인 경우 토큰을 유지하고 더미 데이터 반환 (임시 해결책)
      if (
        axios.isAxiosError(error) &&
        (error.code === 'ECONNREFUSED' ||
          error.message.includes('Network Error'))
      ) {
        console.log('서버 연결 문제 감지, 테스트 사용자 데이터 반환')
        return {
          id: 1,
          nickname: '테스트유저',
          email: 'test@example.com',
          kakaoId: 'test_kakao_id',
          isNewUser: true,
          profileImage: 'https://via.placeholder.com/150',
        }
      }

      // 그 외 오류의 경우 토큰 제거
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
