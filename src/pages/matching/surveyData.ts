import { SurveyQuestions, SurveyResultData } from './types'

export const surveyQuestions: SurveyQuestions = {
  1: [
    {
      id: 'smoke',
      question: '흡연을 하시나요?',
      options: [
        { value: 'Yes', label: '예' },
        { value: 'No', label: '아니오' },
      ],
    },
    {
      id: 'snore',
      question: '코골이나 이갈이를 하시나요?',
      options: [
        { value: 'Yes', label: '예' },
        { value: 'No', label: '아니오' },
      ],
    },
    {
      id: 'lightSleep',
      question: '잠귀가 예민한 편인가요?',
      options: [
        { value: 'Yes', label: '예' },
        { value: 'No', label: '아니오' },
      ],
    },
    {
      id: 'wakeupTime',
      question: '보통 몇 시에 일어나시나요?',
      options: [
        { value: 'Early', label: '7시 이전' },
        { value: 'Normal', label: '7-9시' },
        { value: 'Late', label: '9시 이후' },
      ],
    },
    {
      id: 'bedTime',
      question: '보통 몇 시에 주무시나요?',
      options: [
        { value: 'Early', label: '10시 이전' },
        { value: 'Normal', label: '10-12시' },
        { value: 'Late', label: '12시 이후' },
      ],
    },
    {
      id: 'showerTime',
      question: '샤워는 주로 언제 하시나요?',
      options: [
        { value: 'Morning', label: '아침' },
        { value: 'Evening', label: '저녁' },
      ],
    },
    {
      id: 'cleaning',
      question: '청소는 얼마나 자주 하시나요?',
      options: [
        { value: 'Daily', label: '매일' },
        { value: 'Weekly', label: '주 1-2회' },
        { value: 'Monthly', label: '월 1-2회' },
      ],
    },
  ],
  2: [
    {
      id: 'noise',
      question: '소음에 대해 얼마나 민감하신가요?',
      options: [
        { value: 'Very', label: '매우 민감' },
        { value: 'Moderate', label: '보통' },
        { value: 'NotMuch', label: '둔감' },
      ],
    },
    {
      id: 'guest',
      question: '친구나 지인을 집에 초대하시나요?',
      options: [
        { value: 'Often', label: '자주' },
        { value: 'Sometimes', label: '가끔' },
        { value: 'Never', label: '거의 없음' },
      ],
    },
    {
      id: 'alcohol',
      question: '음주를 하시나요?',
      options: [
        { value: 'Often', label: '자주' },
        { value: 'Sometimes', label: '가끔' },
        { value: 'Never', label: '안 함' },
      ],
    },
    {
      id: 'studyAtHome',
      question: '집에서 공부/일을 하시나요?',
      options: [
        { value: 'Yes', label: '예' },
        { value: 'No', label: '아니오' },
      ],
    },
    {
      id: 'temperature',
      question: '선호하는 실내 온도는?',
      options: [
        { value: 'Cool', label: '서늘하게' },
        { value: 'Moderate', label: '보통' },
        { value: 'Warm', label: '따뜻하게' },
      ],
    },
    {
      id: 'sharing',
      question: '물건을 공유하는 것에 대해 어떻게 생각하시나요?',
      options: [
        { value: 'Positive', label: '긍정적' },
        { value: 'Selective', label: '선택적' },
        { value: 'Negative', label: '부정적' },
      ],
    },
    {
      id: 'pet',
      question: '반려동물을 키우시나요?',
      options: [
        { value: 'Yes', label: '예' },
        { value: 'No', label: '아니오' },
      ],
    },
    {
      id: 'allergy',
      question: '알레르기가 있으신가요? (반려동물, 먼지 등)',
      options: [
        { value: 'Yes', label: '예' },
        { value: 'No', label: '아니오' },
      ],
    },
  ],
}

// 더미 설문 결과 데이터
export const dummySurveyResults: { [key: number]: SurveyResultData } = {
  1: {
    smoke: 'No',
    snore: 'No',
    lightSleep: 'Yes',
    wakeupTime: 'Normal',
    bedTime: 'Normal',
    showerTime: 'Morning',
    cleaning: 'Weekly',
    noise: 'Moderate',
    guest: 'Sometimes',
    alcohol: 'Sometimes',
    studyAtHome: 'Yes',
    temperature: 'Moderate',
    sharing: 'Selective',
    pet: 'No',
    allergy: 'No',
  },
  2: {
    smoke: 'No',
    snore: 'Yes',
    lightSleep: 'No',
    wakeupTime: 'Early',
    bedTime: 'Early',
    showerTime: 'Evening',
    cleaning: 'Daily',
    noise: 'NotMuch',
    guest: 'Never',
    alcohol: 'Never',
    studyAtHome: 'Yes',
    temperature: 'Cool',
    sharing: 'Positive',
    pet: 'No',
    allergy: 'Yes',
  },
}
