import React, { useState } from 'react';
import { UserInfo } from './types';
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
} from './styles';

interface Props {
    onSubmit: (userInfo: UserInfo) => void;
}

export default function UserInfoForm({ onSubmit }: Props) {
    const [userInfo, setUserInfo] = useState<UserInfo>({
        kakaoId: '',
        instagram: '',
        description: '',
        location: '1기숙사',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(userInfo);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLocationSelect = (location: '1기숙사' | '2기숙사' | '3기숙사') => {
        setUserInfo((prev) => ({
            ...prev,
            location,
        }));
    };

    const isFormValid = userInfo.kakaoId && userInfo.instagram && userInfo.description && userInfo.location;

    return (
        <FormContainer>
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