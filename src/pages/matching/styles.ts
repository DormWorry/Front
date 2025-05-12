import styled from 'styled-components'

// 전체 페이지를 감싸는 컨테이너 - 현대적인 디자인으로 업데이트
export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  gap: 40px;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    gap: 25px;
    padding: 1rem;
    height: 100%;
  }
`

// 카드 캐러셀 컨테이너 - 화면 너비 활용 및 모던한 디자인
export const CarouselContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 1200px;
  height: auto;
  transform-style: preserve-3d;
  transition: all 0.5s ease;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  align-items: stretch;
  justify-content: center;
  padding: 2rem;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  max-height: calc(100vh - 180px);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: 100%;
    padding: 1.5rem;
    max-height: calc(100vh - 160px);
  }
`

// 캐러셀 내의 개별 카드 스타일 - 더 현대적이고 세련된 디자인
export const Card = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  min-height: 450px;
  max-width: 350px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  transform-style: preserve-3d;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 130px;
    background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
    z-index: 1;
  }

  .detail-hint {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 10;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
  }

  .detail-hint span {
    background: rgba(97, 97, 255, 0.9);
    color: white;
    font-size: 0.8rem;
    padding: 5px 15px;
    border-radius: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:hover .detail-hint {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 400px;
    max-width: 100%;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: scale(0.98);
    transition: transform 0.1s;
  }
`

// 프로필 이미지를 표시하는 원형 컨테이너
export const ProfileImage = styled.div`
  position: relative;
  margin-bottom: 20px;
  width: 110px;
  height: 110px;
  background: #f0f0f0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border: 5px solid white;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    margin-bottom: 15px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`

// 카드 내용을 감싸는 컨테이너
export const CardContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 100px 20px 30px;
  z-index: 2;
  cursor: pointer;
  
  /* 클릭 효과 강화 */
  &:active {
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    padding: 90px 20px 25px;
  }
`

// 이름 표시 스타일 - 더 모던한 타이포그래피
export const Name = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 10px 0 5px;
  letter-spacing: -0.01em;
  width: 100%;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0 5px;
`

// 역할/소속 표시를 위한 태그 스타일 - 강조된 디자인
export const Role = styled.div`
  font-size: 0.95rem;
  color: #6161FF;
  font-weight: 500;
  background: #f0f0ff;
  padding: 3px 15px;
  border-radius: 30px;
  display: inline-block;
  margin-bottom: 18px;
`

// 설명 텍스트 스타일 - 가독성 개선
export const Description = styled.p`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.6;
  margin: 5px 0 24px;
  text-align: left;
  padding: 0 5px;
  flex-grow: 1;
  max-height: 120px;
  overflow-y: auto;
  width: 100%;
  word-break: break-word;
  min-height: 80px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    max-height: 100px;
  }
`

// 유효성 검사 오류 메시지 스타일
export const ErrorText = styled.p`
  font-size: 0.8rem;
  color: #ff3b30;
  margin-top: 5px;
  margin-bottom: 0;
  text-align: left;
`

// 연락처 정보를 표시하는 컨테이너 - 세련된 디자인
export const ContactInfo = styled.div`
  width: 100%;
  font-size: 0.9rem;
  color: #555;
  text-align: left;
  margin-top: auto;
  background: rgba(246, 248, 252, 0.8);
  padding: 12px 15px;
  border-radius: 12px;
  border: 1px solid #f0f0f0;

  div {
    margin: 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`

// 이전/다음 버튼을 감싸는 컨테이너
export const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  gap: 100px;
  padding-top: 70px;
`

// 이전/다음 버튼 스타일
export const Button = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4F4F4F;
  font-size: 1.2rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
    background: #f8f9fa;
  }

  &:active {
    transform: translateY(0);
    border-color: #00b8b8;
  }

  svg {
    width: 24px;
    height: 24px;
    color: #666;
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: #00b8b8;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`

// 설문조사 폼을 감싸는 컨테이너
export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding-top: 0px;
    width: 100%;
  }
`

// 설문조사 제목 스타일
export const FormTitle = styled.h2`
  text-align: center;
  color: #333;
  font-size: 2rem;
`

// FormWrapper 컴포넌트를 수정하여 form 태그로 렌더링되도록 합니다
export const FormWrapper = styled.form`
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 20px;
  }
`

// 설문조사 그룹 스타일
export const FormGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

// 라벨 스타일
export const Label = styled.label`
  display: block;
  color: #666;
  font-size: 1.1rem;
  align-self: flex-start;
`

// 입력 필드 스타일
const inputStyles = `
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
    color: #333;

  

  &:focus {
    outline: none;
    border-color: #00b8b8;
  }
`

export const Input = styled.input`
  ${inputStyles}
`

export const TextArea = styled.textarea`
  ${inputStyles}
  min-height: 100px;
`

export const LocationContainer = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
`

export const LocationButton = styled.button<{ $isSelected: boolean }>`
  padding: 0.8rem 1.4rem;
  width: 100%;
  border: 2px solid ${(props) => (props.$isSelected ? '#00b8b8' : '#ddd')};

  border-radius: 8px;
  background-color: ${(props) => (props.$isSelected ? '#e6ffff' : 'white')};
  color: ${(props) => (props.$isSelected ? '#00b8b8' : '#666')};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;

  &:hover {
    border-color: #00b8b8;
    color: #00b8b8;
  }
`

export const SubmitButton = styled.button`
  width: 200px;
  height: 40px;
  border-radius: 10px;
  background-color: #00b8b8;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #009999;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  @media (max-width: 768px) {
    width: 88%;
  }
`

// 전체 페이지를 감싸는 컨테이너
export const IndexContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`

// 모달 오버레이 스타일
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

// 모달 내용을 감싸는 컨테이너
export const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  position: relative;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  
  h2 {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    width: 95%;
    gap: 1rem;
  }
`

// 모달 닫기 버튼 스타일
export const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`

// 뒤로 가기 버튼 스타일
export const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1;

  &:hover {
    background: #f0f0f0;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    top: 10px;
    left: 10px;
  }
`

// 룸메이트 타입 선택 그리드 레이아웃
export const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  padding: 8px;
  max-width: 1200px;
  overflow-y: auto;
  height: 480px;
  -webkit-overflow-scrolling: touch;
  position: relative;

  mask-image: linear-gradient(to bottom, black 0%, black 85%, transparent);
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    height: 400px;
    margin-bottom: 0.8rem;
    mask-image: none;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #00b8b8;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #009999;
  }
`

// 룸메이트 타입 카드 스타일
export const TypeCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`

export const TypeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  @media (max-width: 768px) {
    flex: 1;
  }
`

export const MobileButtons = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    gap: 0.5rem;
  }
`

export const ToggleButton = styled.button<{ $isActive?: boolean }>`
  background: ${(props) => (props.$isActive ? '#00b8b8' : '#f0f0f0')};
  color: ${(props) => (props.$isActive ? 'white' : '#666')};
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$isActive ? '#009999' : '#e0e0e0')};
  }
`

export const MobileContent = styled.div<{ $isVisible: boolean }>`
  @media (max-width: 768px) {
    display: ${(props) => (props.$isVisible ? 'block' : 'none')};
    width: 100%;
    margin-top: ${(props) => (props.$isVisible ? '1rem' : '0')};
    padding-top: ${(props) => (props.$isVisible ? '1rem' : '0')};
    border-top: ${(props) => (props.$isVisible ? '1px solid #eee' : 'none')};
  }
`

// 룸메이트 타입 제목 스타일
export const TypeTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    margin: 0 !important;
    font-size: 1.2rem;
  }
`

// 룸메이트 타입 이모지 스타일
export const TypeEmoji = styled.span`
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

// 타입 이모지 스타일

// 룸메이트 특성 목록을 감싸는 컨테이너
export const TraitList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`

// 룸메이트 개별 특성 스타일
export const Trait = styled.li`
  margin: 0.5rem 0;
  color: #666;
`

// 룸메이트 타입 설명 스타일
export const TypeDescription = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin-top: 1rem;
  line-height: 1.4;
`

// 타입 선택 단계 제목 스타일
export const StepTitle = styled.h1`
  font-size: 1.6rem;
  color: #333;
  text-align: center;
  margin-bottom: 0.3rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`

// 타입 선택 단계 설명 스타일
export const StepDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-bottom: 0.8rem;
  }
`

// 타입 선택 단계를 감싸는 컨테이너
export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

// 단계 인디케이터 컨테이너
export const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    gap: 15px;
    margin-bottom: 0.8rem;
  }
`

export const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

export const Step = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $isActive, $isCompleted }) =>
    $isActive || $isCompleted ? '#00b8b8' : '#e0e0e0'};
  color: white;
  font-weight: bold;
`

export const StepText = styled.span<{
  $isActive: boolean
  $isCompleted: boolean
}>`
  font-size: 14px;
  color: ${(props) =>
    props.$isActive ? '#00b8b8' : props.$isCompleted ? '#00b8b8' : '#e0e0e0'};
  font-weight: ${(props) => (props.$isActive ? '600' : '400')};
`

// 단계 연결선
export const StepLine = styled.div<{ $completed: boolean }>`
  width: 60px;
  height: 2px;
  background-color: ${(props) => (props.$completed ? '#00b8b8' : '#e0e0e0')};
`

// 단계 레이블
export const StepLabel = styled.span<{ active: boolean }>`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.9rem;
  color: ${(props) => (props.active ? '#00b8b8' : '#999999')};
  transition: color 0.3s ease;
  white-space: nowrap;
`

// 다음 단계 버튼 스타일
export const NextButton = styled.button`
  padding-top: 0.3rem;
  padding: 0.8rem 1.5rem;
  background-color: #00b8b8;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #009999;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`

export const PrevButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e0e0e0;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`

// 블러 처리된 텍스트를 위한 스타일 - 더 세련된 디자인
export const BlurredText = styled.span`
  position: relative;
  filter: blur(4px);
  user-select: none;
  transition: all 0.3s ease;
  display: inline-block;
  padding: 2px 4px;
  background: rgba(97, 97, 255, 0.1);
  border-radius: 4px;
  border: 1px dashed rgba(97, 97, 255, 0.3);
  
  &::after {
    content: '크레딧 사용';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.9);
    color: #6161FF;
    padding: 1px 6px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover {
    filter: blur(3px);
    background: rgba(97, 97, 255, 0.15);
    
    &::after {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    filter: blur(3px);
  }
`

// 헤더 관련 스타일 추가 - 더 모던한 디자인
export const MainHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  background: linear-gradient(135deg, #f0f4ff 0%, #f9f9f9 100%);
  border-radius: 20px;
  margin-bottom: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  position: relative;
  width: 100%;
  max-width: 1200px;
`

export const PageTitle = styled.h1`
  margin: 0 0 12px 0;
  font-size: 32px;
  font-weight: 700;
  color: #333;
  letter-spacing: -0.02em;
`

export const HeaderDescription = styled.p`
  color: #666;
  text-align: center;
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
`

// 블러 처리된 그룹을 위한 스타일 - 사용자 피드백 강화
export const BlurredGroup = styled.div<{ isBlurred: boolean }>`
  filter: ${(props) => (props.isBlurred ? 'blur(4px)' : 'none')};
  user-select: ${(props) => (props.isBlurred ? 'none' : 'auto')};
  transition: all 0.3s ease;
  background: ${(props) => (props.isBlurred ? 'rgba(97, 97, 255, 0.08)' : 'rgba(250, 250, 250, 0.8)')};
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
  position: relative;
  border: 1px solid ${(props) => (props.isBlurred ? 'rgba(97, 97, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)')};
  
  ${(props) => props.isBlurred && `
    &::after {
      content: '크레딧 사용하여 연락처 보기';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.9);
      color: #6161FF;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      white-space: nowrap;
      z-index: 2;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      pointer-events: none;
    }
  `}
`

// 크레딧 사용 버튼 - 현대적인 디자인
export const CreditButton = styled.button`
  position: relative;
  top: auto;
  left: auto;
  transform: none;
  width: 100%;
  margin: 0.5rem 0 1rem;
  background: linear-gradient(135deg, #6161FF 0%, #5050FF 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 18px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(97, 97, 255, 0.25);
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #5050FF 0%, #4040FF 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(97, 97, 255, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(97, 97, 255, 0.2);
  }

  &:disabled {
    background: linear-gradient(135deg, #a0a0a0 0%, #c0c0c0 100%);
    cursor: not-allowed;
    box-shadow: none;
  }
  @media (max-width: 768px) {
    width: 100px;
    left: 80%;
    transform: translate(-50%, -50%);
    font-size: 0.65rem;
  }
`

// 크레딧 정보 표시
export const CreditInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
  margin-top: 10px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 8px;

  span {
    font-weight: 500;
    color: #00b8b8;
  }
`

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  text-align: center;
  height: 300px;
  max-width: 500px;
  margin: 0 auto;
  
  h3 {
    margin-bottom: 15px;
    color: #333;
    font-weight: 600;
  }
  

  p {
    color: #666;
  }
`

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  padding: 2rem;

  h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #e74c3c;
  }

  p {
    color: #666;
    margin-bottom: 1.5rem;
  }

  button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;

    &:hover {
      background-color: #2980b9;
    }
  }
`

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-left: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
  vertical-align: middle;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export const ErrorAlert = styled.div`
  padding: 12px 16px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  border-left: 4px solid #ef5350;
`

export const SpinnerContainer = styled.div`
  margin: 30px 0;
  position: relative;
  width: 60px;
  height: 60px;
`

export const WaitingSpinner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid rgba(0, 184, 184, 0.1);
  border-top-color: #00b8b8;
  border-radius: 50%;
  animation: waitingSpinner 1.5s linear infinite;

  @keyframes waitingSpinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export const ActionButton = styled.button`
  background-color: #00b8b8;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  margin: 10px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #019999;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`

export const SecondaryButton = styled(ActionButton)`
  background-color: #f0f0f0;
  color: #666;

  &:hover {
    background-color: #e0e0e0;
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`

export const WaitingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  text-align: center;
  height: 350px;
  max-width: 500px;
  margin: 0 auto;
  
  h3 {
    margin-bottom: 15px;
    color: #333;
    font-weight: 600;
  }
  
  p {
    color: #666;
    margin-bottom: 30px;
  }
`

export const NoMatchContainer = styled(WaitingContainer)`
  h3 {
    color: #e67e22;
  }
`
