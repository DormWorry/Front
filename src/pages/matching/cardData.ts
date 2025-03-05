import { CardData } from './types'

export const cardData: CardData[] = [
  {
    id: 1,
    name: '김철수',
    role: '컴퓨터공학부',
    image: '/path/to/image1.jpg',
    description:
      '안녕하세요! 저는 24살 대학생입니다. 청결하고 규칙적인 생활을 하는 것을 좋아합니다. 취미는 독서와 요리입니다.',
    contact: {
      kakaoId: '카카오 아이디',
      instagram: '@인스타아이디',
      location: '1기숙사',
    },
  },
  {
    id: 2,
    name: '이영희',
    role: '도시공학과',
    image: '/path/to/image2.jpg',
    description:
      '대학원에서 컴퓨터공학을 전공중입니다. 밤늦게까지 공부하는 편이에요. 조용하고 깔끔한 환경을 선호합니다.',
    contact: {
      kakaoId: '카카오 아이디',
      instagram: '@인스타아이디',
      location: '1기숙사',
    },
  },
]
