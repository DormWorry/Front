import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  max-width: 1200px;
  min-height: 600px;
  height: calc(100vh - 4rem);
  margin: 2rem auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  background-color: white;
  display: flex;
  flex-direction: column;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  @media (max-width: 768px) {
    min-height: 100vh;
    height: 100vh;
    margin: 0;
    border-radius: 0;
  }
`

export const MacFrame = styled.div`
  width: 100%;
  height: 2.5rem;
  background-color: #e2e2e2;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  border-bottom: 1px solid #ccc;
  flex-shrink: 0;
`

export const MacControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const MacButton = styled.button<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }
`

export const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 20rem 1fr;
  flex: 1;
  width: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f7f7f7;
  height: 100%;
  border-right: 1px solid #eaeaea;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
    border-right: none;
    border-bottom: 1px solid #eaeaea;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
  }
`

export const ContentContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #13cfb8;
  color: white;
  border: none;
  padding: 0.65rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #10b8a3;
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;

    span {
      display: none;
    }
  }
`

export const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    margin-bottom: 0;
  }
`

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const RoomNumber = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 0.2rem;
  }
`

export const UserName = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0;
  }
`

export const ActionButton = styled.button`
  background-color: #13cfb8;
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #10b8a3;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  position: relative;
  padding-bottom: 1rem;
  border-bottom: 1px solid #13cfb8;
  flex-shrink: 0;

  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    flex-grow: 1;
    text-align: center;
    margin: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 1rem;

    h1 {
      font-size: 1.4rem;
    }
  }
`

export const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0;
  min-height: 0;
  overflow: hidden;
`

export const TabHeader = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid #13cfb8;
  flex-shrink: 0;
`

export const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => (props.$active ? '#f0f0f0' : 'transparent')};
  border: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  font-size: 1rem;
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  color: ${(props) => (props.$active ? '#13CFB8' : '#666')};
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid
    ${(props) => (props.$active ? '#13CFB8' : 'transparent')};

  &:hover {
    background-color: ${(props) => (props.$active ? '#f0f0f0' : '#f9f9f9')};
  }
`

export const LetterList = styled.div<{ $needsScroll: boolean }>`
  flex-grow: 1;
  overflow-y: ${(props) => (props.$needsScroll ? 'auto' : 'hidden')};
  min-height: 0;
  max-height: none;
  padding-right: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #cccccc;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
    border-radius: 4px;
  }
`

export const LetterItem = styled.div`
  padding: 1rem;
  background-color: white;
  margin-bottom: 0.25rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e0e0e0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`

export const LetterNumber = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: #13cfb8;
  margin-bottom: 0.5rem;
`

export const LetterTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

export const LetterSummary = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
  white-space: pre-wrap;
`

export const LetterDate = styled.p`
  font-size: 0.8rem;
  color: #999;
  text-align: right;
`

export const EmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #999;
  text-align: center;
  flex-grow: 1;

  svg {
    margin-bottom: 1rem;
    color: #ccc;
  }
`

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
`

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`

export const LetterContent = styled.div`
  white-space: pre-wrap;
  margin-bottom: 2rem;
  line-height: 1.6;
`

export const LetterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`

export const ActionButton2 = styled.button`
  background-color: white;
  color: #13cfb8;
  border: 1px solid #13cfb8;
  border-radius: 9999px;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f4ff;
  }

  &.primary {
    background-color: #13cfb8;
    color: white;

    &:hover {
      background-color: #10b8a3;
    }
  }
`

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

export const Label = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.2s;
  background-color: #ffffff;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  color: black;
  font-family:
    'Noto Serif KR',
    serif,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen;

  &:focus {
    outline: none;
    border-color: #13cfb8;
    box-shadow: 0 0 0 3px rgba(19, 207, 184, 0.15);
  }

  @media (max-width: 768px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`

export const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  color: black;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s;
  background-color: #ffffff;
  background-image: none;
  line-height: 2rem;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  font-family:
    'Noto Serif KR',
    serif,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen;

  &:focus {
    outline: none;
    border-color: #13cfb8;
    box-shadow: 0 0 0 3px rgba(19, 207, 184, 0.15);
  }

  &::placeholder {
    color: #adb5bd;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    padding: 0.6rem;
    font-size: 0.9rem;
    min-height: 80px;
  }
`

export const CharCount = styled.div`
  text-align: right;
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.25rem;
`

export const ScrollMessage = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: #888;
  padding: 0.5rem;
  height: 2rem; /* 고정 높이 설정 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

export const SubmitButton = styled.button`
  background-color: #13cfb8;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #10b8a3;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`

export const CancelButton = styled.button`
  background-color: #f1f3f5;
  color: #495057;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e9ecef;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`

// ComposeForm 관련 스타일 컴포넌트
export const ComposeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const ComposeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const InputLabel = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #343a40;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #495057;
  cursor: pointer;
  user-select: none;
  margin-top: 0.5rem;
`

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #13cfb8;
  cursor: pointer;
`

export const ErrorText = styled.div`
  color: #ff6b6b;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  font-weight: 500;
  display: flex;
  align-items: center;

  &::before {
    content: '⚠️';
    margin-right: 0.25rem;
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px dashed #ddd;
`

export const LetterMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #777;
  margin-top: 5px;
`

export const LetterRoom = styled.span`
  font-weight: 500;
`

export const ScrollIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
  color: #666;
  font-size: 14px;
  opacity: 0.8;
  animation: pulse 1.5s infinite;
  background-color: #f7f7f7;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }

  svg {
    margin-right: 5px;
  }
`
