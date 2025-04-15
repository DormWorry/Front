import { CardData } from './types'

export const cardData: CardData[] = [
  {
    id: 1,
    name: '김철수',
    role: '컴퓨터공학부',
    image: '/user.png',
    description:
      '안녕하세요! 저는 24살 대학생입니다. 청결하고 규칙적인 생활을 하는 것을 좋아합니다. 취미는 독서와 요리입니다.',
    contact: {
      kakaoId: 'chulsu123',
      instagram: '@chulsu_cooking',
      location: '1기숙사',
    },
    personalityTypeId: 3, // 부지런한 깔끔쟁이
  },
  {
    id: 2,
    name: '이영희',
    role: '도시공학과',
    image: '/user.png',
    description:
      '대학원에서 컴퓨터공학을 전공중입니다. 밤늦게까지 공부하는 편이에요. 조용하고 깔끔한 환경을 선호합니다.',
    contact: {
      kakaoId: 'younghee_study',
      instagram: '@younghee_urban',
      location: '1기숙사',
    },
    personalityTypeId: 3, // 집중이 필요한 공부러
  },
  {
    id: 3,
    name: '박민수',
    role: '경영학부',
    image: '/user.png',
    description:
      '안녕하세요! 저는 22살입니다. 운동을 좋아하고 규칙적인 생활을 중요시합니다. 주말에는 자전거를 타고 산책하는 것을 즐깁니다.',
    contact: {
      kakaoId: 'minsu_bike',
      instagram: '@minsu_fitness',
      location: '2기숙사',
    },
    personalityTypeId: 3, // 사교적인 활동러
  },
  {
    id: 4,
    name: '최지원',
    role: '심리학과',
    image: '/user.png',
    description:
      '심리학을 전공하는 3학년입니다. 조용한 환경에서 독서하는 것을 좋아합니다. 취미는 요가와 명상입니다.',
    contact: {
      kakaoId: 'jiwon_psych',
      instagram: '@jiwon_yoga',
      location: '2기숙사',
    },
    personalityTypeId: 4, // 조용한 독서가
  },
  {
    id: 5,
    name: '정현우',
    role: '기계공학과',
    image: '/user.png',
    description:
      '기계공학을 전공하는 대학원생입니다. DIY를 좋아하고 새로운 것을 만드는 것을 즐깁니다. 주말에는 자동차 정비를 합니다.',
    contact: {
      kakaoId: 'hyunwoo_mech',
      instagram: '@hyunwoo_diy',
      location: '3기숙사',
    },
    personalityTypeId: 6, // 독립적인 미니멀리스트
  },
  {
    id: 6,
    name: '한서연',
    role: '영어영문학과',
    image: '/user.png',
    description:
      '영어영문학을 전공하는 2학년입니다. 영화 감상과 독서를 좋아합니다. 외국인 친구들과 교류하는 것을 즐깁니다.',
    contact: {
      kakaoId: 'seoyeon_eng',
      instagram: '@seoyeon_books',
      location: '3기숙사',
    },
    personalityTypeId: 8, // 소셜 네트워커
  },
  {
    id: 7,
    name: '강민준',
    role: '의예과',
    image: '/user.png',
    description:
      '의예과 1학년입니다. 의학에 관심이 많고, 공부를 열심히 하고 있습니다. 운동을 통해 스트레스를 해소합니다.',
    contact: {
      kakaoId: 'minjun_med',
      instagram: '@minjun_health',
      location: '4기숙사',
    },
    personalityTypeId: 9, // 집중이 필요한 공부러
  },
  {
    id: 8,
    name: '김수아',
    role: '디자인학과',
    image: '/user.png',
    description:
      '디자인을 전공하는 3학년입니다. 그림 그리기와 사진 촬영을 좋아합니다. 창의적인 작업을 즐깁니다.',
    contact: {
      kakaoId: 'sua_design',
      instagram: '@sua_art',
      location: '4기숙사',
    },
    personalityTypeId: 5, // 밤샘형 넷플릭스 매니아
  },
  {
    id: 9,
    name: '이준호',
    role: '화학공학과',
    image: '/user.png',
    description:
      '화학공학을 전공하는 대학원생입니다. 실험실에서 많은 시간을 보내고 있습니다. 과학 관련 뉴스를 자주 읽습니다.',
    contact: {
      kakaoId: 'junho_chem',
      instagram: '@junho_science',
      location: '5기숙사',
    },
    personalityTypeId: 2, // 자유로운 밤샘러
  },
  {
    id: 10,
    name: '박지민',
    role: '경제학과',
    image: '/user.png',
    description:
      '경제학을 전공하는 4학년입니다. 주식 투자에 관심이 많고, 경제 관련 서적을 많이 읽습니다. 취미는 테니스입니다.',
    contact: {
      kakaoId: 'jimin_econ',
      instagram: '@jimin_invest',
      location: '5기숙사',
    },
    personalityTypeId: 8, // 소셜 네트워커
  },
  {
    id: 11,
    name: '최서현',
    role: '생명과학과',
    image: '/user.png',
    description:
      '생명과학을 전공하는 2학년입니다. 자연을 사랑하고 동물을 좋아합니다. 주말에는 등산을 즐깁니다.',
    contact: {
      kakaoId: 'seohyun_bio',
      instagram: '@seohyun_nature',
      location: '6기숙사',
    },
    personalityTypeId: 1, // 사교적인 활동러
  },
  {
    id: 12,
    name: '정민재',
    role: '전자공학과',
    image: '/user.png',
    description:
      '전자공학을 전공하는 3학년입니다. 프로그래밍과 전자기기를 좋아합니다. 취미는 게임 개발입니다.',
    contact: {
      kakaoId: 'minjae_elec',
      instagram: '@minjae_dev',
      location: '6기숙사',
    },
    personalityTypeId: 7, // 게임러 야식러
  },
]
