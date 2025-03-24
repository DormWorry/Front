import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 사용자 프로필 타입 정의
export type UserProfile = {
  nickname: string;
  studentId: string;
  department: string;
  dormitoryId: string;
  roomNumber: string;
  gender: string;
  isNewUser?: boolean;
};

const authApi = {
  // 카카오 로그인 URL 가져오기
  getKakaoLoginUrl: () => {
    const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const REDIRECT_URI = `${API_BASE_URL}/auth/kakao/callback`;
    return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  },
  
  // 사용자 프로필 업데이트 (신규 회원가입 시)
  updateUserProfile: async (profileData: UserProfile) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
    }
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      throw error;
    }
  },
  
  // 현재 로그인한 사용자 정보 조회
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error);
      localStorage.removeItem('token');
      return null;
    }
  },
};

export default authApi;
