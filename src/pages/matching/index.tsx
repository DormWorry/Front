import { useState } from 'react';
import CardCarousel from './CardCarousel';
import RoommateTypeSelector from './RoommateTypeSelector';
import UserInfoForm from './UserInfoForm';
import BackButton from '@/components/common/BackButton';
import { IndexContainer } from './styles';
import { RoommateType, UserInfo } from './types';

export default function MatchingFeature() {
  const [selectedType, setSelectedType] = useState<RoommateType | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const handleTypeSelect = (type: RoommateType) => {
    setSelectedType(type);
  };

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
  };

  const renderStep = () => {
    if (!selectedType) {
      return <RoommateTypeSelector onTypeSelect={handleTypeSelect} />;
    }
    if (!userInfo) {
      return <UserInfoForm onSubmit={handleUserInfoSubmit} />;
    }
    return <CardCarousel selectedType={selectedType} />;
  };

  return (
    <IndexContainer>
      <BackButton />
      {renderStep()}
    </IndexContainer>
  );
}
