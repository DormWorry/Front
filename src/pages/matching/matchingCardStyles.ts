import styled, { keyframes } from 'styled-components'

// 애니메이션 효과
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

// 매칭 결과 페이지 메인 컨테이너
export const MatchingResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  min-height: calc(100vh - 150px);
  padding: 20px 0;
  background-color: #f8f9fa;
  overflow: hidden;
`

// 섹션 헤더
export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 20px;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
`

export const MainTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`

export const SubTitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 5px;
`

// 필터 및 정렬 옵션
export const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding: 0 20px;
  animation: ${fadeIn} 0.6s ease-out;
`

export const FilterButton = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  background-color: ${(props) => (props.active ? '#4AD295' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#333')};
  border: 1px solid #eaeaea;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: ${(props) => (props.active ? '#3BC286' : '#f5f5f5')};
    transform: translateY(-2px);
  }
`

// 카드 그리드 컨테이너
export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  padding: 10px 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
    padding: 10px;
  }
`

// 룸메이트 카드 스타일
export const RoommateCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  min-height: 400px;
  animation: ${fadeIn} 0.6s ease-out;
  border: 1px solid rgba(0, 0, 0, 0.03);
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  }
`

export const CardHeader = styled.div`
  position: relative;
  height: 100px;
  background: linear-gradient(135deg, #4ad295, #3bc286);
  border-radius: 16px 16px 0 0;
  overflow: hidden;
`

export const CardPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
`

export const ProfileImageContainer = styled.div`
  position: absolute;
  bottom: -45px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 4px solid #fff;
  background: #f5f5f5;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

export const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const CardBody = styled.div`
  padding: 55px 20px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const RoommateInfo = styled.div`
  text-align: center;
  margin-bottom: 15px;
`

export const RoommateName = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`

export const DormitoryBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background-color: #e8f7f0;
  color: #2aa876;
  border-radius: 30px;
  font-size: 0.85rem;
  margin-bottom: 12px;
  font-weight: 500;
`

export const IntroText = styled.p`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
  margin-bottom: 15px;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: center;
`

export const PersonalityTypeContainer = styled.div`
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 15px;
`

export const TypeHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  justify-content: center;
`

export const TypeEmoji = styled.span`
  font-size: 1.5rem;
  margin-right: 8px;
`

export const TypeName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`

export const TypeTraits = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
`

export const TraitTag = styled.span`
  font-size: 0.8rem;
  padding: 3px 10px;
  background-color: #e8f7f0;
  color: #2aa876;
  border-radius: 20px;
`

export const CardFooter = styled.div`
  padding: 10px 20px 20px;
  display: flex;
  justify-content: center;
`

export const ContactButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #4ad295;
  color: #fff;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(74, 210, 149, 0.2);

  &:hover {
    background-color: #3bc286;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`

// 모달 스타일
export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-out;
`

export const ModalContent = styled.div`
  position: relative;
  width: 90%;
  max-width: 500px;
  background-color: #fff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-height: 80vh;
  overflow-y: auto;
  animation: ${fadeIn} 0.4s ease-out;
`

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`

export const ModalHeader = styled.div`
  margin-bottom: 20px;
  text-align: center;
`

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 5px;
  color: #333;
`

export const ModalSubTitle = styled.p`
  font-size: 1rem;
  color: #666;
`

export const DetailSection = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 12px;
`

export const SectionTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 12px;
  color: #333;
  font-weight: 600;
`

export const ContactSection = styled.div`
  margin-bottom: 20px;
`

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #e8f7f0;
  border-radius: 10px;
`

export const ContactIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 10px;
  color: #4ad295;
`

export const ContactText = styled.span`
  font-size: 1rem;
  color: #333;
`

// 로딩 및 오류 상태 스타일
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 20px;
  text-align: center;
  padding: 20px;
  animation: ${fadeIn} 0.6s ease-out;
`

export const WaitingSpinnerContainer = styled.div`
  margin: 20px 0;
`

export const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #6161ff;
  border-radius: 50%;
  animation: ${rotateAnimation} 1s linear infinite;
`

export const ActionButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 300px;
  margin-top: 20px;
`

export const PrimaryButton = styled.button`
  padding: 12px 20px;
  background-color: #6161ff;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(97, 97, 255, 0.2);

  &:hover {
    background-color: #5252e0;
    transform: translateY(-2px);
  }
`

export const SecondaryButton = styled.button`
  padding: 12px 20px;
  background-color: #fff;
  color: #6161ff;
  border: 1px solid #6161ff;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5ff;
    transform: translateY(-2px);
  }
`

export const NavButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
`

export const NavButton = styled.button`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #eaeaea;
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
  }

  svg {
    width: 18px;
    height: 18px;
    fill: #6161ff;
  }
`

export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  min-height: 300px;
  animation: ${fadeIn} 0.6s ease-out;
`

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  color: #ddd;
  margin-bottom: 20px;
  animation: ${pulseAnimation} 2s infinite ease-in-out;
`

export const EmptyStateText = styled.h3`
  font-size: 1.3rem;
  color: #555;
  margin-bottom: 10px;
`

export const EmptyStateSubText = styled.p`
  font-size: 1rem;
  color: #888;
  margin-bottom: 20px;
`

export const NoMoreCard = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  color: #6161ff;
  font-weight: 600;
  font-size: 1.1rem;
  border: 1px dashed #6161ff;
  margin: 20px 0;
`
