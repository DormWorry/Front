import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  gap: 50px;
  padding: 20px;

  @media (max-width: 768px) {
    gap: 30px;
  }
`

export const CarouselContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    width: 100%;
    height: 450px;
  }
`

export const Card = styled.div`
  position: absolute;
  width: 280px;
  height: 300px;
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
  backface-visibility: hidden;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 85%;
    max-width: 280px;
    height: auto;
    min-height: 300px;
  }

  &:hover {
    transform: scale(1.05);
  }
`

export const ProfileImage = styled.div`
  position: absolute;
  top: -60px;
  width: 100px;
  height: 100px;
  background: #f0f0f0;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 4px solid white;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const CardContent = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 20px;
`

export const Name = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 5px;
`

export const Role = styled.div`
  font-size: 1rem;
  color: #666;
  background: #e8f0fe;
  padding: 5px 15px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 15px;
`

export const Description = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
  text-align: left;
  padding: 0 10px;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`

export const ContactInfo = styled.div`
  width: 100%;
  font-size: 0.8rem;
  color: #888;
  text-align: left;
  padding: 0 10px;

  div {
    margin: 5px 0;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`

export const ButtonContainer = styled.div`
  display: flex;
  gap: 70px;
  position: relative;

  @media (max-width: 768px) {
    gap: 40px;
  }
`

export const Button = styled.button<{ left?: boolean; right?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f0f0;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`

// Survey 관련 스타일 컴포넌트 추가
export const FormContainer = styled.div`
  width: 800px;
  height: 800px;
  margin: 0 auto;
  padding: 3rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    border-radius: 0;
  }
`

export const SurveyTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const SurveySubtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
`

export const QuestionContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

export const Question = styled.div`
  margin-bottom: 1rem;
`

export const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
`

export const SurveyInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 0.5rem;
`

export const ErrorMessage = styled.p`
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`

export const ButtonWrapper = styled.div`
  margin-top: auto;
  padding-top: 2rem;
  display: flex;
  justify-content: center;
`

export const SurveyButton = styled.button`
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
`

export const IndexContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

export const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`

export const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`

export const SurveyResult = styled.div`
  margin-top: 1rem;

  h3 {
    color: #333;
    margin-bottom: 1rem;
  }

  .question {
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
  }

  .answer {
    color: #666;
    margin-top: 0.25rem;
  }
`

export const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f0f0;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    top: 10px;
    left: 10px;
  }
`
