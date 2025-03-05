export interface LetterData {
  id: string
  roomNumber: string
  title: string
  content: string
  date: string
  read: boolean
}

export const sentLettersDummy: LetterData[] = [
  {
    id: 'sent-1',
    roomNumber: '504호',
    title: '힘내세요!',
    content: '안녕하세요! 이번 시험기간 열심히 공부하시는 모습 정말 멋져요. 시험 잘 보시길 바랄게요. 화이팅!',
    date: '2025-02-20(목)',
    read: true
  },
  {
    id: 'sent-2',
    roomNumber: '302호',
    title: '요리 레시피 공유해요',
    content: '지난번에 말씀하신 김치찌개 레시피 공유해드립니다. 돼지고기를 먼저 볶다가 김치를 넣고 같이 볶은 후, 물을 부어 끓이면 맛있는 김치찌개가 완성됩니다! 맛있게 드세요~',
    date: '2025-02-15(토)',
    read: true
  },
  {
    id: 'sent-3',
    roomNumber: '107호',
    title: '소음 문제에 대해',
    content: '안녕하세요, 107호 주민입니다. 최근 저녁 시간에 발생하는 소음에 대해 말씀드리고 싶어요. 조금만 더 조용히 해주시면 감사하겠습니다.',
    date: '2025-02-10(월)',
    read: true
  },
  {
    id: 'sent-4',
    roomNumber: '801호',
    title: '택배 보관 감사합니다',
    content: '제가 없을 때 택배를 받아주셔서 정말 감사합니다. 덕분에 중요한 물품을 안전하게 받을 수 있었어요. 다음에 기회가 되면 맛있는 것 사들고 인사드릴게요!',
    date: '2025-02-05(수)',
    read: true
  },
  {
    id: 'sent-5',
    roomNumber: '608호',
    title: '주차 협조 요청',
    content: '608호 주민입니다. 주차장에서 제 자리에 다른 차가 자주 주차되어 있어 불편함이 있습니다. 주차 규칙을 지켜주시면 감사하겠습니다.',
    date: '2025-01-30(월)',
    read: true
  },
  {
    id: 'sent-6',
    roomNumber: '203호',
    title: '커피 맛집 추천',
    content: '지난번 대화에서 커피를 좋아하신다고 하셔서, 아파트 근처 맛있는 카페를 추천해드립니다. 특히 디저트와 함께 드시면 정말 맛있어요!',
    date: '2025-01-25(수)',
    read: true
  },
  {
    id: 'sent-7',
    roomNumber: '405호',
    title: '음악회 초대',
    content: '다음 주 토요일에 소규모 음악회를 개최합니다. 관심 있으시면 참석해주세요. 좋은 음악과 함께 즐거운 시간 보내실 수 있을 거예요.',
    date: '2025-01-20(금)',
    read: true
  },
  {
    id: 'sent-8',
    roomNumber: '901호',
    title: '공동 구매 안내',
    content: '이번 주에 유기농 과일 공동 구매를 진행합니다. 참여하고 싶으시면 내일까지 연락주세요. 같이 구매하시면 더 저렴하게 구매가 가능해요!',
    date: '2025-01-15(수)',
    read: true
  }
]

export const receivedLettersDummy: LetterData[] = [
  {
    id: 'received-1',
    roomNumber: '705호',
    title: '반가워요, 이웃님!',
    content: '새로 이사 오신 것 환영합니다! 저는 705호에 사는 김지민이라고 합니다. 궁금한 것 있으시면 언제든지 물어보세요. 앞으로 잘 지내봐요~',
    date: '2025-02-25(화)',
    read: true
  },
  {
    id: 'received-2',
    roomNumber: '1203호',
    title: '층간 소음에 대해',
    content: '안녕하세요, 위층에 사는 1203호입니다. 혹시 최근에 제 집에서 발생하는 소음으로 불편함을 겪고 계신지요? 최대한 조심하고 있지만, 불편한 점이 있으시면 알려주세요.',
    date: '2025-02-22(토)',
    read: true
  },
  {
    id: 'received-3',
    roomNumber: '502호',
    title: '분리수거 안내',
    content: '안녕하세요, 관리사무소입니다. 다음 주부터 분리수거 방법이 변경됩니다. 플라스틱과 캔은 별도의 봉투에 담아주시기 바랍니다. 협조 부탁드립니다.',
    date: '2025-02-18(화)',
    read: true
  },
  {
    id: 'received-4',
    roomNumber: '304호',
    title: '주민 모임 초대',
    content: '다음 주 일요일 오후 3시에 주민 친목 모임이 있습니다. 관심 있으시면 참석해주세요. 간단한 다과와 함께 이웃들과 좋은 시간 보내실 수 있을 거예요!',
    date: '2025-02-15(토)',
    read: true
  },
  {
    id: 'received-5',
    roomNumber: '1001호',
    title: '택배 보관 안내',
    content: '안녕하세요, 오늘 귀하 앞으로 온 택배를 제가 보관하고 있습니다. 편하실 때 1001호로 방문해주세요. 저녁 10시 이전에 오시면 됩니다.',
    date: '2025-02-10(월)',
    read: true
  },
  {
    id: 'received-6',
    roomNumber: '605호',
    title: '화분 관리 부탁',
    content: '안녕하세요, 다음 주에 여행을 가게 되어서 현관 앞 화분 관리를 부탁드립니다. 3일에 한 번씩 물을 주시면 됩니다. 돌아와서 맛있는 선물로 보답할게요!',
    date: '2025-02-08(토)',
    read: true
  },
  {
    id: 'received-7',
    roomNumber: '802호',
    title: '소모임 안내',
    content: '아파트 내 독서 소모임을 시작합니다. 매주 수요일 저녁 7시에 도서관에서 모임이 있을 예정입니다. 함께 책읽고 대화나누는 시간을 가져봐요!',
    date: '2025-02-05(수)',
    read: true
  },
  {
    id: 'received-8',
    roomNumber: '1102호',
    title: '주차 문제에 대해',
    content: '최근 주차장에서 종종 트러블이 발생하고 있습니다. 모두가 편하게 사용할 수 있도록 지정된 주차구역을 잘 지켜주시길 부탁드립니다.',
    date: '2025-02-03(월)',
    read: true
  },
  {
    id: 'received-9',
    roomNumber: '410호',
    title: '환경 보호 캠페인',
    content: '다음 달부터 쓰레기 줄이기 캠페인을 시작합니다. 일회용품 사용을 줄이고, 재활용을 적극 실천해주세요. 지구를 위한 작은 실천이 큰 변화를 만듭니다.',
    date: '2025-01-30(목)',
    read: true
  },
  {
    id: 'received-10',
    roomNumber: '909호',
    title: '아침 운동 함께해요',
    content: '매일 아침 6시에 단지 내 공원에서 가벼운 운동을 하고 있습니다. 관심 있으신 분들은 언제든지 함께하세요. 건강한 하루의 시작을 함께 만들어봐요!',
    date: '2025-01-25(토)',
    read: true
  }
]
