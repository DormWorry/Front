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

export const userAtom = atom<UserState>({
  key: 'userState',
  default: {
    isLoggedIn: false
  },
});
