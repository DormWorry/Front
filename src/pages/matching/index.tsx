import { useState, useEffect } from 'react';
import CardCarousel from './CardCarousel';
import RoommateTypeSelector from './RoommateTypeSelector';
import UserInfoForm from './UserInfoForm';
import { useRouter } from 'next/router';
import { RoommateType, UserInfo } from './types';
import * as S from '../order/order-styles';
import roommateApi from '../../api/roommate';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../atoms/userAtom';
import { LoadingContainer } from './styles';

export default function MatchingFeature() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [myType, setMyType] = useState<RoommateType | null>(null);
  const [preferredType, setPreferredType] = useState<RoommateType | null>(null);
  const [, setUserInfo] = useState<UserInfo | null>(null);
  const [checkingProfile, setCheckingProfile] = useState<boolean>(true);
  const currentUser = useRecoilValue(userAtom);
  
  // 사용자 프로필 확인 - 이미 프로필이 있으면 바로 매칭 결과 화면으로 이동
  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        if(currentUser.id) {
          try {
            // 사용자의 프로필 정보 가져오기
            const userProfile = await roommateApi.getMyProfile();
            
            if (userProfile) {
              console.log('프로필 개설 확인:', userProfile);
              
              // 프로필의 선호 타입 ID 가져오기
              const preferredTypeId = userProfile.preferredPersonalityType?.id;
              
              // 전체 프로필 조회 API를 통해 모든 유형 정보 가져오기
              const profiles = await roommateApi.getProfiles();
              const types = profiles.map(profile => profile.myPersonalityType).filter(Boolean);
              const uniqueTypes = types.filter((type, index, self) => 
                index === self.findIndex(t => t.id === type.id)
              );
              
              // 선호 타입 찾기
              const foundType = uniqueTypes.find(type => type.id === preferredTypeId);
              
              // 타입 정보 설정 및 매칭 결과 페이지로 바로 이동
              if(foundType) {
                console.log('선호 타입 및 자동 리디렉션:', foundType);
                setPreferredType(foundType);
                setStep(4); // 바로 매칭 결과 화면으로 이동
              } else if(preferredTypeId) {
                // 타입 ID가 있지만 매칭되는 타입을 찾지 못한 경우
                console.log('타입 ID는 있지만 매칭되는 것을 찾지 못함:', preferredTypeId);
                // 기본 타입으로 설정하고 결과 페이지로 이동
                if (uniqueTypes.length > 0) {
                  setPreferredType(uniqueTypes[0]);
                  setStep(4);
                }
              }
            }
          } catch (profileError) {
            // 프로필이 없는 경우 (일반적인 플로우 진행)
            console.log('프로필이 없습니다. 일반 플로우로 진행합니다.');
          }
        }
        setCheckingProfile(false);
      } catch (error) {
        console.error('프로필 확인 중 오류 발생:', error);
        setCheckingProfile(false);
      }
    };
    
    checkUserProfile();
  }, [currentUser.id]);

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

  // 프로필 확인 중 로딩 화면 표시
  if (checkingProfile) {
    return (
      <LoadingContainer>
        <h3>프로필 정보 확인 중...</h3>
        <p>잠시만 기다려주세요.</p>
      </LoadingContainer>
    );
  }

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
