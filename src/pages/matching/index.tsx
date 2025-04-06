import { useState } from 'react';
import CardCarousel from './CardCarousel';
import RoommateTypeSelector from './RoommateTypeSelector';
import UserInfoForm from './UserInfoForm';
import { useRouter } from 'next/router';
import { RoommateType, UserInfo } from './types';
import * as S from '../order/order-styles';

export default function MatchingFeature() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [myType, setMyType] = useState<RoommateType | null>(null);
  const [preferredType, setPreferredType] = useState<RoommateType | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const goToMainPage = () => {
    router.push('/main');
  };

  const handleTypeSelect = (type: RoommateType) => {
    if (step === 1) {
      setMyType(type);
    } else {
      setPreferredType(type);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && myType) {
      setStep(2);
    } else if (step === 2 && preferredType) {
      setStep(3);
    }
  };

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setStep(4); // 매칭 시작하기 클릭 시 카드 캐러셀로 이동
  };

  const handleStepChange = (newStep: 1 | 2 | 3 | 4) => {
    setStep(newStep);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
      case 2:
        return <RoommateTypeSelector
          currentStep={step}
          myType={myType}
          preferredType={preferredType}
          onTypeSelect={handleTypeSelect}
          onStepChange={handleStepChange}
          onNextStep={handleNextStep}
        />;
      case 3:
        return <UserInfoForm
          onSubmit={handleUserInfoSubmit}
          onStepChange={handleStepChange}
          myTypeId={myType?.id || 0}
          preferredTypeId={preferredType?.id || 0}
        />;
      case 4:
        return <CardCarousel selectedType={preferredType!} />;
      default:
        return null;
    }
  };

  return (
    <S.Container style={{ padding: '20px 0px 20px 0px' }}>
      <S.MainHeader>
        <S.BackButton onClick={goToMainPage}>←</S.BackButton>
        <S.PageTitle>룸메이트 찾기</S.PageTitle>
        <S.HeaderDescription>
          나와 잘 맞는 기숙사 친구를 찾아보세요!
        </S.HeaderDescription>
      </S.MainHeader>
      {renderStep()}
    </S.Container>
  );
}
