import { atom } from 'recoil';

export interface UserState {
  id?: number;
  nickname?: string;
  email?: string;
  studentId?: string;
  department?: string;
  dormitoryId?: number;
  roomNumber?: string;
  gender?: string;
  isNewUser?: boolean;
  kakaoId?: string;
  profileImage?: string;  // 카카오톡 프로필 이미지 URL
  thumbnailImage?: string;  // 카카오톡 프로필 썸네일 이미지 URL
  token?: string;        // 사용자 인증 토큰
  isLoggedIn: boolean;
}

// 중복 atom 키 경고 방지를 위해 고유한 카테고리 메타데이터를 포함하여 키 생성
const generateUniqueId = () => {
  // 개발 환경에서는 매번 새로운 ID가 생성되어야 HMR 문제를 피할 수 있음
  return typeof window !== 'undefined' ? `userState_${Date.now()}` : 'userState_SSR';
};

export const userAtom = atom<UserState>({
  key: generateUniqueId(),
  default: {
    isLoggedIn: false
  },
});
