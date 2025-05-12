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
  isLoggedIn: boolean;
}

export const userAtom = atom<UserState>({
  key: 'userState',
  default: {
    isLoggedIn: false
  },
});
