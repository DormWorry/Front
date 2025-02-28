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
} from './styles';

interface Props {
    onTypeSelect: (type: RoommateType) => void;
}

export default function RoommateTypeSelector({ onTypeSelect }: Props) {
    const [step, setStep] = useState<1 | 2>(1);
    const [myType, setMyType] = useState<RoommateType | null>(null);
    const [preferredType, setPreferredType] = useState<RoommateType | null>(null);

    const handleMyTypeSelect = (type: RoommateType) => {
        setMyType(type);
    };

    const handlePreferredTypeSelect = (type: RoommateType) => {
        setPreferredType(type);
    };

    const handleNextStep = () => {
        if (step === 1 && myType) {
            setStep(2);
        } else if (step === 2 && preferredType) {
            onTypeSelect(preferredType);
        }
    };

    return (
        <StepContainer>
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
                onClick={handleNextStep}
                disabled={step === 1 ? !myType : !preferredType}
            >
                {step === 1 ? '다음 단계' : '매칭 시작하기'}
            </NextButton>
        </StepContainer>
    );
} 