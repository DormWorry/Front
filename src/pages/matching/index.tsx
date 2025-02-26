import { useState } from 'react';
import CardCarousel from './CardCarousel';
import SurveyForm from './Survey';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function MatchingFeature() {
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);

  const handleSurveyComplete = () => {
    setIsSurveyCompleted(true);
  };

  return (
    <Container>
      {!isSurveyCompleted ? (
        <SurveyForm onComplete={handleSurveyComplete} />
      ) : (
        <CardCarousel />
      )}
    </Container>
  );
}
