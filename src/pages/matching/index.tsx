import { useState } from 'react';
import CardCarousel from './CardCarousel';
import RoommateTypeSelector from './RoommateTypeSelector';
import UserInfoForm from './UserInfoForm';
import BackButton from '@/components/common/BackButton';
import { IndexContainer } from './styles';
import { RoommateType, UserInfo } from './types';

export default function MatchingFeature() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [myType, setMyType] = useState<RoommateType | null>(null);
  const [preferredType, setPreferredType] = useState<RoommateType | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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
        />;
      case 4:
        return <CardCarousel selectedType={preferredType!} />;
      default:
        return null;
    }
  };

  return (
    <IndexContainer>
      <BackButton />
      {renderStep()}
    </IndexContainer>
  );
}
