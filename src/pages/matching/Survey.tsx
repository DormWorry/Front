import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  width: 800px;
  height: 800px;
  margin: 0 auto;
  padding: 3rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const QuestionContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Question = styled.div`
  margin-bottom: 1rem;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const ErrorMessage = styled.p`
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const ButtonWrapper = styled.div`
  margin-top: auto;
  padding-top: 2rem;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 200px;
  
  &:hover {
    background: #5f4dd1;
  }
`;

interface QuestionData {
    answer: string;
    error: string;
}

interface SurveyFormProps {
    onComplete: () => void;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<{ [key: string]: QuestionData }>({
        // 1페이지 (7개)
        smoke: { answer: '', error: '' },
        snore: { answer: '', error: '' },
        lightSleep: { answer: '', error: '' },
        wakeupTime: { answer: '', error: '' },
        bedTime: { answer: '', error: '' },
        showerTime: { answer: '', error: '' },
        cleaning: { answer: '', error: '' },

        // 2페이지 (8개)
        noise: { answer: '', error: '' },
        guest: { answer: '', error: '' },
        alcohol: { answer: '', error: '' },
        studyAtHome: { answer: '', error: '' },
        temperature: { answer: '', error: '' },
        sharing: { answer: '', error: '' },
        pet: { answer: '', error: '' },
        allergy: { answer: '', error: '' }
    });

    const validateStep = (step: number) => {
        let isValid = true;
        const newFormData = { ...formData };

        const validateQuestions = (questions: string[]) => {
            questions.forEach(question => {
                if (!formData[question].answer) {
                    newFormData[question].error = '답변을 선택해주세요';
                    isValid = false;
                }
            });
        };

        if (step === 1) {
            validateQuestions(['smoke', 'snore', 'lightSleep', 'wakeupTime', 'bedTime', 'showerTime', 'cleaning']);
        } else if (step === 2) {
            validateQuestions(['noise', 'guest', 'alcohol', 'studyAtHome', 'temperature', 'sharing', 'pet', 'allergy']);
        }

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
            // API 호출 등 제출 로직 추가
            onComplete(); // 설문 완료 시 호출
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
            <Title>Roommate Matching Survey</Title>
            <Subtitle>나에게 맞는 룸메이트를 찾기 위한 설문조사입니다</Subtitle>

            {currentStep === 1 && (
                <QuestionContainer>
                    <Question>
                        <div>흡연을 하시나요?</div>
                        <RadioGroup>
                            <label><input type="radio" name="smoke" value="Yes" checked={formData.smoke.answer === 'Yes'} onChange={(e) => handleInputChange('smoke', e.target.value)} /> 예</label>
                            <label><input type="radio" name="smoke" value="No" checked={formData.smoke.answer === 'No'} onChange={(e) => handleInputChange('smoke', e.target.value)} /> 아니오</label>
                        </RadioGroup>
                        {formData.smoke.error && <ErrorMessage>{formData.smoke.error}</ErrorMessage>}
                    </Question>

                    <Question>
                        <div>코골이나 이갈이를 하시나요?</div>
                        <RadioGroup>
                            <label><input type="radio" name="snore" value="Yes" checked={formData.snore.answer === 'Yes'} onChange={(e) => handleInputChange('snore', e.target.value)} /> 예</label>
                            <label><input type="radio" name="snore" value="No" checked={formData.snore.answer === 'No'} onChange={(e) => handleInputChange('snore', e.target.value)} /> 아니오</label>
                        </RadioGroup>
                        {formData.snore.error && <ErrorMessage>{formData.snore.error}</ErrorMessage>}
                    </Question>

                    <Question>
                        <div>잠귀가 예민한 편인가요?</div>
                        <RadioGroup>
                            <label><input type="radio" name="lightSleep" value="Yes" checked={formData.lightSleep.answer === 'Yes'} onChange={(e) => handleInputChange('lightSleep', e.target.value)} /> 예</label>
                            <label><input type="radio" name="lightSleep" value="No" checked={formData.lightSleep.answer === 'No'} onChange={(e) => handleInputChange('lightSleep', e.target.value)} /> 아니오</label>
                        </RadioGroup>
                        {formData.lightSleep.error && <ErrorMessage>{formData.lightSleep.error}</ErrorMessage>}
                    </Question>

                    <Question>
                        <div>보통 몇 시에 일어나시나요?</div>
                        <RadioGroup>
                            <label><input type="radio" name="wakeupTime" value="Early" checked={formData.wakeupTime.answer === 'Early'} onChange={(e) => handleInputChange('wakeupTime', e.target.value)} /> 7시 이전</label>
                            <label><input type="radio" name="wakeupTime" value="Normal" checked={formData.wakeupTime.answer === 'Normal'} onChange={(e) => handleInputChange('wakeupTime', e.target.value)} /> 7-9시</label>
                            <label><input type="radio" name="wakeupTime" value="Late" checked={formData.wakeupTime.answer === 'Late'} onChange={(e) => handleInputChange('wakeupTime', e.target.value)} /> 9시 이후</label>
                        </RadioGroup>
                        {formData.wakeupTime.error && <ErrorMessage>{formData.wakeupTime.error}</ErrorMessage>}
                    </Question>

                    <Question>
                        <div>보통 몇 시에 주무시나요?</div>
                        <RadioGroup>
                            <label><input type="radio" name="bedTime" value="Early" checked={formData.bedTime.answer === 'Early'} onChange={(e) => handleInputChange('bedTime', e.target.value)} /> 10시 이전</label>
                            <label><input type="radio" name="bedTime" value="Normal" checked={formData.bedTime.answer === 'Normal'} onChange={(e) => handleInputChange('bedTime', e.target.value)} /> 10-12시</label>
                            <label><input type="radio" name="bedTime" value="Late" checked={formData.bedTime.answer === 'Late'} onChange={(e) => handleInputChange('bedTime', e.target.value)} /> 12시 이후</label>
                        </RadioGroup>
                        {formData.bedTime.error && <ErrorMessage>{formData.bedTime.error}</ErrorMessage>}
                    </Question>

                    <Question>
                        <div>샤워는 주로 언제 하시나요?</div>
                        <RadioGroup>
                            <label><input type="radio" name="showerTime" value="Morning" checked={formData.showerTime.answer === 'Morning'} onChange={(e) => handleInputChange('showerTime', e.target.value)} /> 아침</label>
                            <label><input type="radio" name="showerTime" value="Evening" checked={formData.showerTime.answer === 'Evening'} onChange={(e) => handleInputChange('showerTime', e.target.value)} /> 저녁</label>
                        </RadioGroup>
                        {formData.showerTime.error && <ErrorMessage>{formData.showerTime.error}</ErrorMessage>}
                    </Question>

                    <Question>
                        <div>청소는 얼마나 자주 하시나요?</div>
                        <RadioGroup>
                            <label><input type="radio" name="cleaning" value="Daily" checked={formData.cleaning.answer === 'Daily'} onChange={(e) => handleInputChange('cleaning', e.target.value)} /> 매일</label>
                            <label><input type="radio" name="cleaning" value="Weekly" checked={formData.cleaning.answer === 'Weekly'} onChange={(e) => handleInputChange('cleaning', e.target.value)} /> 주 1-2회</label>
                            <label><input type="radio" name="cleaning" value="Monthly" checked={formData.cleaning.answer === 'Monthly'} onChange={(e) => handleInputChange('cleaning', e.target.value)} /> 월 1-2회</label>
                        </RadioGroup>
                        {formData.cleaning.error && <ErrorMessage>{formData.cleaning.error}</ErrorMessage>}
                    </Question>

                    <ButtonWrapper>
                        <Button onClick={handleNext}>Next</Button>
                    </ButtonWrapper>
                </QuestionContainer>
            )}

            {currentStep === 2 && (
                <QuestionContainer>
                    <Question>
                        <div>소음에 대해 얼마나 민감하신가요?</div>
                        <RadioGroup>
                            <label><input type="radio" name="noise" value="Very" checked={formData.noise.answer === 'Very'} onChange={(e) => handleInputChange('noise', e.target.value)} /> 매우 민감</label>
                            <label><input type="radio" name="noise" value="Moderate" checked={formData.noise.answer === 'Moderate'} onChange={(e) => handleInputChange('noise', e.target.value)} /> 보통</label>
                            <label><input type="radio" name="noise" value="NotMuch" checked={formData.noise.answer === 'NotMuch'} onChange={(e) => handleInputChange('noise', e.target.value)} /> 둔감</label>
                        </RadioGroup>
                        {formData.noise.error && <ErrorMessage>{formData.noise.error}</ErrorMessage>}
                    </Question>

                    <Question>
                        <div>친구나 지인을 집에 초대하시나요?</div>
                        <RadioGroup>
                            <label><input type="radio" name="guest" value="Often" checked={formData.guest.answer === 'Often'} onChange={(e) => handleInputChange('guest', e.target.value)} /> 자주</label>
                            <label><input type="radio" name="guest" value="Sometimes" checked={formData.guest.answer === 'Sometimes'} onChange={(e) => handleInputChange('guest', e.target.value)} /> 가끔</label>
                            <label><input type="radio" name="guest" value="Never" checked={formData.guest.answer === 'Never'} onChange={(e) => handleInputChange('guest', e.target.value)} /> 거의 없음</label>
                        </RadioGroup>
                        {formData.guest.error && <ErrorMessage>{formData.guest.error}</ErrorMessage>}
                    </Question>

                    <Question>
                        <div>음주를 하시나요?</div>
                        <RadioGroup>
                            <label><input type="radio" name="alcohol" value="Often" checked={formData.alcohol.answer === 'Often'} onChange={(e) => handleInputChange('alcohol', e.target.value)} /> 자주</label>
                            <label><input type="radio" name="alcohol" value="Sometimes" checked={formData.alcohol.answer === 'Sometimes'} onChange={(e) => handleInputChange('alcohol', e.target.value)} /> 가끔</label>
                            <label><input type="radio" name="alcohol" value="Never" checked={formData.alcohol.answer === 'Never'} onChange={(e) => handleInputChange('alcohol', e.target.value)} /> 안 함</label>
                        </RadioGroup>
                        {formData.alcohol.error && <ErrorMessage>{formData.alcohol.error}</ErrorMessage>}
                    </Question>

                    <Question>
                        <div>집에서 공부/일을 하시나요?</div>
                        <RadioGroup>
                            <label><input type="radio" name="studyAtHome" value="Yes" checked={formData.studyAtHome.answer === 'Yes'} onChange={(e) => handleInputChange('studyAtHome', e.target.value)} /> 예</label>
                            <label><input type="radio" name="studyAtHome" value="No" checked={formData.studyAtHome.answer === 'No'} onChange={(e) => handleInputChange('studyAtHome', e.target.value)} /> 아니오</label>
                        </RadioGroup>
                        {formData.studyAtHome.error && <ErrorMessage>{formData.studyAtHome.error}</ErrorMessage>}
                    </Question>

                    <Question>
                        <div>선호하는 실내 온도는?</div>
                        <RadioGroup>
                            <label><input type="radio" name="temperature" value="Cool" checked={formData.temperature.answer === 'Cool'} onChange={(e) => handleInputChange('temperature', e.target.value)} /> 서늘하게</label>
                            <label><input type="radio" name="temperature" value="Moderate" checked={formData.temperature.answer === 'Moderate'} onChange={(e) => handleInputChange('temperature', e.target.value)} /> 보통</label>
                            <label><input type="radio" name="temperature" value="Warm" checked={formData.temperature.answer === 'Warm'} onChange={(e) => handleInputChange('temperature', e.target.value)} /> 따뜻하게</label>
                        </RadioGroup>
                        {formData.temperature.error && <ErrorMessage>{formData.temperature.error}</ErrorMessage>}
                    </Question>

                    <Question>
                        <div>물건을 공유하는 것에 대해 어떻게 생각하시나요?</div>
                        <RadioGroup>
                            <label><input type="radio" name="sharing" value="Positive" checked={formData.sharing.answer === 'Positive'} onChange={(e) => handleInputChange('sharing', e.target.value)} /> 긍정적</label>
                            <label><input type="radio" name="sharing" value="Selective" checked={formData.sharing.answer === 'Selective'} onChange={(e) => handleInputChange('sharing', e.target.value)} /> 선택적</label>
                            <label><input type="radio" name="sharing" value="Negative" checked={formData.sharing.answer === 'Negative'} onChange={(e) => handleInputChange('sharing', e.target.value)} /> 부정적</label>
                        </RadioGroup>
                        {formData.sharing.error && <ErrorMessage>{formData.sharing.error}</ErrorMessage>}
                    </Question>

                    <Question>
                        <div>반려동물을 키우시나요?</div>
                        <RadioGroup>
                            <label><input type="radio" name="pet" value="Yes" checked={formData.pet.answer === 'Yes'} onChange={(e) => handleInputChange('pet', e.target.value)} /> 예</label>
                            <label><input type="radio" name="pet" value="No" checked={formData.pet.answer === 'No'} onChange={(e) => handleInputChange('pet', e.target.value)} /> 아니오</label>
                        </RadioGroup>
                        {formData.pet.error && <ErrorMessage>{formData.pet.error}</ErrorMessage>}
                    </Question>

                    <Question>
                        <div>알레르기가 있으신가요? (반려동물, 먼지 등)</div>
                        <RadioGroup>
                            <label><input type="radio" name="allergy" value="Yes" checked={formData.allergy.answer === 'Yes'} onChange={(e) => handleInputChange('allergy', e.target.value)} /> 예</label>
                            <label><input type="radio" name="allergy" value="No" checked={formData.allergy.answer === 'No'} onChange={(e) => handleInputChange('allergy', e.target.value)} /> 아니오</label>
                        </RadioGroup>
                        {formData.allergy.error && <ErrorMessage>{formData.allergy.error}</ErrorMessage>}
                    </Question>

                    <ButtonWrapper>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </ButtonWrapper>
                </QuestionContainer>
            )}
        </FormContainer>
    );
};

export default SurveyForm;