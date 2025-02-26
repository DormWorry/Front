import { useState } from 'react';
import CardCarousel from './CardCarousel';
import SurveyForm from './Survey';
import BackButton from '@/components/common/BackButton';
import { IndexContainer } from './styles';

export default function MatchingFeature() {
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);

  return (
    <IndexContainer>
      <BackButton />
      {!isSurveyCompleted ? (
        <SurveyForm onComplete={() => setIsSurveyCompleted(true)} />
      ) : (
        <CardCarousel />
      )}
    </IndexContainer>
  );
}
