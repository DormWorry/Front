import styled from 'styled-components'

// 전체 페이지를 감싸는 컨테이너. 3D 효과를 위한 perspective 설정 포함
export const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  gap: 50px;
  padding-top: 100px;
  @media (max-width: 768px) {
    gap: 30px;
  }
`

// 3D 회전 효과를 가진 카드 캐러셀을 감싸는 컨테이너
export const CarouselContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    width: 100%;
    height: 450px;
  }
`

// 캐러셀 내의 개별 카드 스타일
export const Card = styled.div`
  position: absolute;
  width: 280px;
  height: 300px;
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
  backface-visibility: hidden;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 85%;
    max-width: 280px;
    height: auto;
    min-height: 300px;
  }

  &:hover {
    transform: scale(1.05);
  }
`

// 프로필 이미지를 표시하는 원형 컨테이너
export const ProfileImage = styled.div`
  position: absolute;
  top: -60px;
  width: 100px;
  height: 100px;
  background: #f0f0f0;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 4px solid white;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

// 카드 내용을 감싸는 컨테이너
export const CardContent = styled.div`
  width: 100%;
  text-align: center;
  padding-top: 8px;
`

// 이름 표시 스타일
export const Name = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 5px;
`

// 역할/소속 표시를 위한 태그 스타일
export const Role = styled.div`
  font-size: 1rem;
  color: #666;
  background: #e8f0fe;
  padding: 5px 15px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 15px;
`

// 설명 텍스트 스타일
export const Description = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
  text-align: left;
  padding: 0 10px;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`

// 연락처 정보를 표시하는 컨테이너
export const ContactInfo = styled.div`
  width: 100%;
  font-size: 0.8rem;
  color: #888;
  text-align: left;
  padding: 0 10px;

  div {
    margin: 5px 0;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`

// 이전/다음 버튼을 감싸는 컨테이너
export const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
  justify-content: center;
  gap: 100px;
  padding-top: 100px;
`

// 이전/다음 버튼 스타일
export const Button = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    border-color: #00b8b8;
    background: #f8f8f8;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    background: #f8f8f8;
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
  max-width: 600px;
  margin: 0 auto;
  padding-top: 30px;
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
  align-items: center;
  gap: 25px;
`

// 설문조사 그룹 스타일
export const FormGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: space-between;
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
  width: 300px;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
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
  resize: vertical;
`

export const LocationContainer = styled.div`
  display: flex;
  gap: 1rem;
`

export const LocationButton = styled.button<{ isSelected: boolean }>`
  padding: 0.8rem 1.4rem;
  border: 2px solid ${(props) => (props.isSelected ? '#00b8b8' : '#ddd')};
  border-radius: 8px;
  background-color: ${(props) => (props.isSelected ? '#e6ffff' : 'white')};
  color: ${(props) => (props.isSelected ? '#00b8b8' : '#666')};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;

  &:hover {
    border-color: #00b8b8;
    color: #00b8b8;
  }
`

export const SubmitButton = styled.button`
  width: 330px;
  height: 40px;
  border-radius: 10px;
  margin-top: 20px;
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
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
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

// 설문 결과를 표시하는 컨테이너
export const SurveyResult = styled.div`
  margin-top: 1rem;

  h3 {
    color: #333;
    margin-bottom: 1rem;
  }

  .question {
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
  }

  .answer {
    color: #666;
    margin-top: 0.25rem;
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
  padding: 0.5rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 1rem;
  overflow-y: auto;
  height: 500px;
  -webkit-overflow-scrolling: touch;
  position: relative;

  mask-image: linear-gradient(
    to bottom,
    transparent,
    black 10%,
    black 90%,
    transparent
  );

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    height: 280px;
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
    gap: 0.6rem;
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

export const ToggleButton = styled.button<{ isActive?: boolean }>`
  background: ${(props) => (props.isActive ? '#00b8b8' : '#f0f0f0')};
  color: ${(props) => (props.isActive ? 'white' : '#666')};
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
    background: ${(props) => (props.isActive ? '#009999' : '#e0e0e0')};
  }
`

export const MobileContent = styled.div<{ isVisible: boolean }>`
  @media (max-width: 768px) {
    display: ${(props) => (props.isVisible ? 'block' : 'none')};
    width: 100%;
    margin-top: ${(props) => (props.isVisible ? '1rem' : '0')};
    padding-top: ${(props) => (props.isVisible ? '1rem' : '0')};
    border-top: ${(props) => (props.isVisible ? '1px solid #eee' : 'none')};
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
  padding-top: 10px;
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
    gap: 20px;
    margin-bottom: 0.8rem;
  }
`

export const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

export const Step = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ isActive, isCompleted }) =>
    isActive || isCompleted ? '#00b8b8' : '#e0e0e0'};
  color: white;
  font-weight: bold;
`

export const StepText = styled.span<{
  isActive: boolean
  isCompleted: boolean
}>`
  font-size: 14px;
  color: ${(props) =>
    props.isActive ? '#00b8b8' : props.isCompleted ? '#00b8b8' : '#e0e0e0'};
  font-weight: ${(props) => (props.isActive ? '600' : '400')};
`

// 단계 연결선
export const StepLine = styled.div<{ completed: boolean }>`
  width: 60px;
  height: 2px;
  background-color: ${(props) => (props.completed ? '#00b8b8' : '#e0e0e0')};
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

// 블러 처리된 텍스트를 위한 스타일
export const BlurredText = styled.span`
  filter: blur(4px);
  user-select: none;
  transition: filter 0.3s ease;

  &:hover {
    filter: blur(0);
  }

  @media (max-width: 768px) {
    filter: blur(3px);
  }
`

// 헤더 관련 스타일 추가
export const MainHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  background-color: #f9f9f9;
  border-radius: 12px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  width: 100%;
  max-width: 1200px;
`

export const PageTitle = styled.h1`
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 700;
  color: #333;
`

export const HeaderDescription = styled.p`
  color: #777;
  text-align: center;
  margin: 0;
  font-size: 16px;
`

// 블러 처리된 그룹을 위한 스타일
export const BlurredGroup = styled.div`
  filter: blur(4px);
  user-select: none;
  transition: filter 0.3s ease;
  background: rgba(0, 0, 0, 0.05);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;

  &:hover {
    filter: blur(0);
  }

  @media (max-width: 768px) {
    filter: blur(3px);
  }
`
