import React, { useState } from 'react';
import { RoommateType } from './types';
import { roommateTypes } from './roommateTypes';
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
    TypeHeader,
    MobileButtons,
    ToggleButton,
    MobileContent,
    ButtonContainer,
} from './styles';

interface Props {
    currentStep: 1 | 2;
    myType: RoommateType | null;
    preferredType: RoommateType | null;
    onTypeSelect: (type: RoommateType) => void;
    onStepChange: (step: 1 | 2 | 3) => void;
    onNextStep: () => void;
}

export default function RoommateTypeSelector({
    currentStep,
    myType,
    preferredType,
    onTypeSelect,
    onStepChange,
    onNextStep
}: Props) {
    const [showDescription, setShowDescription] = useState<number | null>(null);
    const [showTraits, setShowTraits] = useState<number | null>(null);

    const handleTypeClick = (type: RoommateType) => {
        onTypeSelect(type);
    };

    const handleStepClick = (targetStep: 1 | 2) => {
        if (targetStep === 1 && currentStep === 2) {
            onStepChange(1);
        }
    };

    const toggleDescription = (typeId: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setShowDescription(showDescription === typeId ? null : typeId);
        setShowTraits(null);
    };

    const toggleTraits = (typeId: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setShowTraits(showTraits === typeId ? null : typeId);
        setShowDescription(null);
    };

    return (
        <StepContainer>
            <StepIndicator>
                <StepWrapper
                    onClick={() => handleStepClick(1)}
                    style={{ cursor: currentStep === 2 ? 'pointer' : 'default' }}
                >
                    <Step isActive={currentStep === 1} isCompleted={currentStep > 1}>1</Step>
                    <StepText isActive={currentStep === 1} isCompleted={currentStep > 1}>나의 유형</StepText>
                </StepWrapper>
                <StepLine completed={currentStep > 1} />
                <StepWrapper>
                    <Step isActive={currentStep === 2} isCompleted={false}>2</Step>
                    <StepText isActive={currentStep === 2} isCompleted={false}>룸메이트 유형</StepText>
                </StepWrapper>
                <StepLine completed={false} />
                <StepWrapper>
                    <Step isActive={false} isCompleted={false}>3</Step>
                    <StepText isActive={false} isCompleted={false}>프로필 정보</StepText>
                </StepWrapper>
            </StepIndicator>
            <StepTitle>
                {currentStep === 1 ? '나의 유형' : '원하는 룸메이트 유형'}
            </StepTitle>
            <StepDescription>
                {currentStep === 1
                    ? '본인과 가장 잘 맞는 유형을 선택해주세요.'
                    : '함께 지내고 싶은 룸메이트의 유형을 선택해주세요.'}
            </StepDescription>
            <TypeGrid>
                {roommateTypes.map((type) => (
                    <TypeCard
                        key={type.id}
                        onClick={() => handleTypeClick(type)}
                        style={{
                            border: (currentStep === 1 ? myType?.id === type.id : preferredType?.id === type.id)
                                ? '2px solid #00b8b8'
                                : '2px solid transparent',
                            boxSizing: 'border-box'
                        }}
                    >
                        <TypeHeader>
                            <TypeTitle>
                                <TypeEmoji>{type.emoji}</TypeEmoji>
                                {type.title}
                            </TypeTitle>
                            <MobileButtons>
                                <ToggleButton
                                    isActive={showDescription === type.id}
                                    onClick={(e) => toggleDescription(type.id, e)}
                                >
                                    ...
                                </ToggleButton>
                                <ToggleButton
                                    isActive={showTraits === type.id}
                                    onClick={(e) => toggleTraits(type.id, e)}
                                >
                                    ?
                                </ToggleButton>
                            </MobileButtons>
                        </TypeHeader>
                        <MobileContent isVisible={showDescription === type.id}>
                            <TypeDescription>{type.description}</TypeDescription>
                        </MobileContent>
                        <MobileContent isVisible={showTraits === type.id}>
                            <TraitList>
                                {type.traits.map((trait, index) => (
                                    <Trait key={index}>{trait}</Trait>
                                ))}
                            </TraitList>
                        </MobileContent>
                    </TypeCard>
                ))}
            </TypeGrid>
            <ButtonContainer style={{ marginTop: '-50px' }}>
                <NextButton
                    onClick={onNextStep}
                    disabled={currentStep === 1 ? !myType : !preferredType}
                >
                    {currentStep === 1 ? '다음 단계' : '내 정보 입력'}
                </NextButton>
            </ButtonContainer>
        </StepContainer>
    );
} 