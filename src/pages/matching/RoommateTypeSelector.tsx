import React from 'react';
import { RoommateType } from './types';
import { roommateTypes } from './roommateTypes';
import { useStep } from '../../hooks/useStep';
import {
    TypeGrid,
    TypeCard,
    TypeTitle,
    TypeEmoji,
    TraitList,
    Trait,
    TypeDescription,
    StepContainer,
    StepTitle,
    StepDescription,
    NextButton,
    StepIndicator,
    Step,
    StepWrapper,
    StepText,
    StepLine,
} from './styles';

interface Props {
    onTypeSelect: (type: RoommateType) => void;
}

export default function RoommateTypeSelector({ onTypeSelect }: Props) {
    const {
        step,
        myType,
        preferredType,
        handleMyTypeSelect,
        handlePreferredTypeSelect,
        handleNextStep,
    } = useStep();

    return (
        <StepContainer>
            <StepIndicator>
                <StepWrapper>
                    <Step isActive={step === 1} isCompleted={step > 1}>1</Step>
                    <StepText isActive={step === 1} isCompleted={step > 1}>나의 유형</StepText>
                </StepWrapper>
                <StepLine completed={step > 1} />
                <StepWrapper>
                    <Step isActive={step === 2} isCompleted={false}>2</Step>
                    <StepText isActive={step === 2} isCompleted={false}>룸메이트 유형</StepText>
                </StepWrapper>
                <StepLine completed={false} />
                <StepWrapper>
                    <Step isActive={false} isCompleted={false}>3</Step>
                    <StepText isActive={false} isCompleted={false}>프로필 정보</StepText>
                </StepWrapper>
            </StepIndicator>
            <StepTitle>
                {step === 1 ? '나의 유형' : '원하는 룸메이트 유형'}
            </StepTitle>
            <StepDescription>
                {step === 1
                    ? '본인과 가장 잘 맞는 유형을 선택해주세요.'
                    : '함께 지내고 싶은 룸메이트의 유형을 선택해주세요.'}
            </StepDescription>
            <TypeGrid>
                {roommateTypes.map((type) => (
                    <TypeCard
                        key={type.id}
                        onClick={() => step === 1 ? handleMyTypeSelect(type) : handlePreferredTypeSelect(type)}
                        style={{
                            border: (step === 1 ? myType?.id === type.id : preferredType?.id === type.id)
                                ? '2px solid #00b8b8'
                                : 'none'
                        }}
                    >
                        <TypeTitle>
                            <TypeEmoji>{type.emoji}</TypeEmoji>
                            {type.title}
                        </TypeTitle>
                        <TraitList>
                            {type.traits.map((trait, index) => (
                                <Trait key={index}>{trait}</Trait>
                            ))}
                        </TraitList>
                        <TypeDescription>{type.description}</TypeDescription>
                    </TypeCard>
                ))}
            </TypeGrid>
            <NextButton
                onClick={() => handleNextStep(onTypeSelect)}
                disabled={step === 1 ? !myType : !preferredType}
            >
                {step === 1 ? '다음 단계' : '내 정보 입력'}
            </NextButton>
        </StepContainer>
    );
} 