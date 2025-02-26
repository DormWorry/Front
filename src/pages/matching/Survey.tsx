import React, { useState } from 'react';
import {
    FormContainer,
    SurveyTitle,
    SurveySubtitle,
    QuestionContainer,
    Question,
    RadioGroup,
    ErrorMessage,
    ButtonWrapper,
    SurveyButton
} from './styles';
import { QuestionData, SurveyFormProps } from './types';
import { surveyQuestions } from './surveyData';

const SurveyForm: React.FC<SurveyFormProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<{ [key: string]: QuestionData }>(() => {
        const initialData: { [key: string]: QuestionData } = {};
        [...surveyQuestions[1], ...surveyQuestions[2]].forEach(q => {
            initialData[q.id] = { answer: '', error: '' };
        });
        return initialData;
    });

    const validateStep = (step: number) => {
        let isValid = true;
        const newFormData = { ...formData };

        surveyQuestions[step].forEach(question => {
            if (!formData[question.id].answer) {
                newFormData[question.id].error = '답변을 선택해주세요';
                isValid = false;
            }
        });

        setFormData(newFormData);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleSubmit = () => {
        if (validateStep(currentStep)) {
            console.log('제출된 데이터:', formData);
            onComplete();
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: { answer: value, error: '' }
        }));
    };

    return (
        <FormContainer>
            <SurveyTitle>Roommate Matching Survey</SurveyTitle>
            <SurveySubtitle>나에게 맞는 룸메이트를 찾기 위한 설문조사입니다</SurveySubtitle>

            <QuestionContainer>
                {surveyQuestions[currentStep].map((q) => (
                    <Question key={q.id}>
                        <div>{q.question}</div>
                        <RadioGroup>
                            {q.options.map((option) => (
                                <label key={option.value}>
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value={option.value}
                                        checked={formData[q.id].answer === option.value}
                                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </RadioGroup>
                        {formData[q.id].error && <ErrorMessage>{formData[q.id].error}</ErrorMessage>}
                    </Question>
                ))}

                <ButtonWrapper>
                    <SurveyButton onClick={currentStep === 1 ? handleNext : handleSubmit}>
                        {currentStep === 1 ? 'Next' : 'Submit'}
                    </SurveyButton>
                </ButtonWrapper>
            </QuestionContainer>
        </FormContainer>
    );
};

export default SurveyForm;