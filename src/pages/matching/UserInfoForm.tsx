import { useState } from 'react';
import { UserInfo, CreateRoommateProfileDto } from './types';
import { useUserInfo } from '../../hooks/matching/useUserInfo';
import roommateApi from '../../api/roommate';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../recoil/atoms/userAtom';
import {
    FormContainer,
    FormWrapper,
    FormTitle,
    FormGroup,
    Label,
    Input,
    TextArea,
    LocationContainer,
    LocationButton,
    ButtonContainer,
    SubmitButton,
    StepIndicator,
    Step,
    StepWrapper,
    StepText,
    StepLine,
    LoadingSpinner,
    ErrorAlert,
    ErrorText
} from './styles';

interface Props {
    onSubmit: (userInfo: UserInfo) => void;
    onStepChange: (step: 1 | 2 | 3) => void;
    myTypeId: number;
    preferredTypeId: number;
}

export default function UserInfoForm({ onSubmit, onStepChange, myTypeId, preferredTypeId }: Props) {
    const { userInfo, errors, isFormValid, handleChange, handleLocationSelect } = useUserInfo();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const userRecoil = useRecoilValue(userAtom);

    const getDormitoryId = (location: string): string => {
        // 실제 백엔드 데이터에 맞게 매핑
        const dormitoryMapping: { [key: string]: string } = {
            '1기숙사': '1',
            '2기숙사': '2',
            '3기숙사': '3'
        };
        return dormitoryMapping[location] || '1';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (!userRecoil?.id) {
                setError('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
                return;
            }

            // 프로필 DTO 생성
            const profileData: CreateRoommateProfileDto = {
                myPersonalityTypeId: myTypeId,
                preferredPersonalityTypeId: preferredTypeId,
                introduction: userInfo.description,
                kakaoTalkId: userInfo.kakaoId,
                instagramId: userInfo.instagram || '',
                dormitoryId: getDormitoryId(userInfo.location)
            };

            console.log('전송할 프로필 데이터:', profileData);

            // 백엔드 API 호출
            const result = await roommateApi.createProfile(profileData);
            console.log('프로필 생성 결과:', result);

            // 성공 시 UI 컴포넌트에 알림
            onSubmit(userInfo);
        } catch (err) {
            console.error('프로필 등록 실패:', err);
            setError('프로필 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStepClick = (targetStep: 1 | 2) => {
        if (targetStep <= 2) { // 1단계나 2단계로만 이동 가능
            onStepChange(targetStep);
        }
    };

    return (
        <FormContainer>
            <StepIndicator>
                <StepWrapper
                    onClick={() => handleStepClick(1)}
                    style={{ cursor: 'pointer' }}
                >
                    <Step $isActive={false} $isCompleted={true}>1</Step>
                    <StepText $isActive={false} $isCompleted={true}>나의 유형</StepText>
                </StepWrapper>
                <StepLine $completed={true} />
                <StepWrapper
                    onClick={() => handleStepClick(2)}
                    style={{ cursor: 'pointer' }}
                >
                    <Step $isActive={false} $isCompleted={true}>2</Step>
                    <StepText $isActive={false} $isCompleted={true}>룸메이트 유형</StepText>
                </StepWrapper>
                <StepLine $completed={true} />
                <StepWrapper>
                    <Step $isActive={true} $isCompleted={false}>3</Step>
                    <StepText $isActive={true} $isCompleted={false}>프로필 정보</StepText>
                </StepWrapper>
            </StepIndicator>
            <FormTitle>프로필 정보 입력</FormTitle>
            {error && <ErrorAlert>{error}</ErrorAlert>}
            <FormWrapper onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>카카오톡 ID</Label>
                    <Input
                        type="text"
                        name="kakaoId"
                        value={userInfo.kakaoId}
                        onChange={handleChange}
                        placeholder="카카오톡 ID를 입력해주세요"
                        disabled={isLoading}
                    />
                    {errors.kakaoId && <ErrorText>{errors.kakaoId}</ErrorText>}
                </FormGroup>
                <FormGroup>
                    <Label>인스타그램 ID</Label>
                    <Input
                        type="text"
                        name="instagram"
                        value={userInfo.instagram}
                        onChange={handleChange}
                        placeholder="인스타그램 ID를 입력해주세요"
                        disabled={isLoading}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>자기소개</Label>
                    <TextArea
                        name="description"
                        value={userInfo.description}
                        onChange={handleChange}
                        placeholder="간단한 자기소개를 작성해주세요 (최소 10자 이상)"
                        disabled={isLoading}
                    />
                    {errors.description && <ErrorText>{errors.description}</ErrorText>}
                </FormGroup>
                <FormGroup >
                    <Label>기숙사 선택</Label>
                    <LocationContainer>
                        <LocationButton
                            type="button"
                            $isSelected={userInfo.location === '1기숙사'}
                            onClick={() => handleLocationSelect('1기숙사')}
                            disabled={isLoading}
                        >
                            1기숙사
                        </LocationButton>
                        <LocationButton
                            type="button"
                            $isSelected={userInfo.location === '2기숙사'}
                            onClick={() => handleLocationSelect('2기숙사')}
                            disabled={isLoading}
                        >
                            2기숙사
                        </LocationButton>
                        <LocationButton
                            type="button"
                            $isSelected={userInfo.location === '3기숙사'}
                            onClick={() => handleLocationSelect('3기숙사')}
                            disabled={isLoading}
                        >
                            3기숙사
                        </LocationButton>
                    </LocationContainer>
                </FormGroup>
                <ButtonContainer style={{ paddingTop: '15px' }}>
                    <SubmitButton
                        type="submit"
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? '처리 중...' : '매칭 시작하기'}
                        {isLoading && <LoadingSpinner />}
                    </SubmitButton>
                </ButtonContainer>
            </FormWrapper>
        </FormContainer>
    );
}
