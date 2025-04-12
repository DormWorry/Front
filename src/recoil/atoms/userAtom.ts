import { atom } from 'recoil'

// 사용자 정보 타입 정의
export interface UserState {
  id?: number
  kakaoId?: number
  nickname?: string
  studentId?: string
  department?: string
  dormitoryId?: string
  roomNumber?: string
  gender?: string
  isNewUser?: boolean
  isLoggedIn: boolean
}

// 초기 사용자 상태
const initialUserState: UserState = {
  isLoggedIn: false,
}

// 사용자 정보를 저장할 atom 생성
export const userAtom = atom<UserState>({
  key: 'userState', // 고유한 키 값
  default: initialUserState,
})
