import React from 'react';
import { UserInfo } from './types';
import { useUserInfo } from '../../hooks/useUserInfo';
import {
    FormContainer,
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
} from './styles';

interface Props {
    onSubmit: (userInfo: UserInfo) => void;
}

export default function UserInfoForm({ onSubmit }: Props) {
    const { userInfo, isFormValid, handleChange, handleLocationSelect } = useUserInfo();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(userInfo);
    };

    return (
        <FormContainer>
            <StepIndicator>
                <StepWrapper>
                    <Step isActive={false} isCompleted={true}>1</Step>
                    <StepText isActive={false} isCompleted={true}>나의 유형</StepText>
                </StepWrapper>
                <StepLine completed={true} />
                <StepWrapper>
                    <Step isActive={false} isCompleted={true}>2</Step>
                    <StepText isActive={false} isCompleted={true}>룸메이트 유형</StepText>
                </StepWrapper>
                <StepLine completed={true} />
                <StepWrapper>
                    <Step isActive={true} isCompleted={false}>3</Step>
                    <StepText isActive={true} isCompleted={false}>프로필 정보</StepText>
                </StepWrapper>
            </StepIndicator>
            <FormTitle>프로필 정보 입력</FormTitle>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>카카오톡 ID</Label>
                    <Input
                        type="text"
                        name="kakaoId"
                        value={userInfo.kakaoId}
                        onChange={handleChange}
                        placeholder="카카오톡 ID를 입력해주세요"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>인스타그램 ID</Label>
                    <Input
                        type="text"
                        name="instagram"
                        value={userInfo.instagram}
                        onChange={handleChange}
                        placeholder="인스타그램 ID를 입력해주세요"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>자기소개</Label>
                    <TextArea
                        name="description"
                        value={userInfo.description}
                        onChange={handleChange}
                        placeholder="간단한 자기소개를 작성해주세요"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>기숙사 선택</Label>
                    <LocationContainer>
                        <LocationButton
                            type="button"
                            isSelected={userInfo.location === '1기숙사'}
                            onClick={() => handleLocationSelect('1기숙사')}
                        >
                            1기숙사
                        </LocationButton>
                        <LocationButton
                            type="button"
                            isSelected={userInfo.location === '2기숙사'}
                            onClick={() => handleLocationSelect('2기숙사')}
                        >
                            2기숙사
                        </LocationButton>
                        <LocationButton
                            type="button"
                            isSelected={userInfo.location === '3기숙사'}
                            onClick={() => handleLocationSelect('3기숙사')}
                        >
                            3기숙사
                        </LocationButton>
                    </LocationContainer>
                </FormGroup>
                <ButtonContainer>
                    <SubmitButton type="submit" disabled={!isFormValid}>
                        매칭 시작하기
                    </SubmitButton>
                </ButtonContainer>
            </form>
        </FormContainer>
    );
} 