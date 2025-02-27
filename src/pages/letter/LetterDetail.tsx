import React from 'react'
import styled from 'styled-components'
import * as S from './letter-styles'
import { LetterDetailProps } from './types'

/**
 * 편지 상세 보기 컴포넌트
 */
const LetterDetail: React.FC<LetterDetailProps> = ({
  letter,
  onClose,
  onReply,
  isReceived = false,
}) => {
  if (!letter) return null

  return (
    <OverlayContainer onClick={onClose}>
      <DetailContainer onClick={(e) => e.stopPropagation()}>
        <DetailMacFrame>
          <MacControls>
            <MacButton color="#FF5F56" onClick={onClose} />
            <MacButton color="#FFBD2E" />
            <MacButton color="#27C93F" />
          </MacControls>
        </DetailMacFrame>

        <LetterContent>
          <div className="letter-header">
            <h2>{letter.title}</h2>
            <div className="letter-meta">
              <span className="letter-sender">
                {isReceived ? '보낸이: ' : '받는이: '}
                {letter.roomNumber}
              </span>
              <span className="letter-date">{letter.date}</span>
            </div>
          </div>
          <div className="letter-body">{letter.content}</div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginTop: '1.5rem',
              borderTop: '1px solid #e9ecef',
              paddingTop: '1.5rem',
            }}
          >
            <S.CancelButton onClick={onClose}>닫기</S.CancelButton>
            {isReceived && onReply && (
              <ReplyButton
                onClick={() => {
                  onReply(letter.roomNumber)
                }}
              >
                답장하기
              </ReplyButton>
            )}
          </div>
        </LetterContent>
      </DetailContainer>
    </OverlayContainer>
  )
}

export default LetterDetail

const OverlayContainer = styled.div`
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

const DetailContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const DetailMacFrame = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fffdf7;
  position: relative;
`

const MacControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #f1f3f5;
  border-bottom: 1px solid #e9ecef;
`

const MacButton = styled.button<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.9);
  }
`

const LetterContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  line-height: 1.6;
  overflow-y: auto;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #343a40;
    word-break: break-word;
  }

  p {
    margin-bottom: 1rem;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .letter-header {
    margin-bottom: 2rem;

    .letter-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: #868e96;
      margin-bottom: 0.5rem;
    }

    .letter-sender {
      font-weight: 500;
    }

    .letter-date {
      font-style: italic;
    }
  }

  .letter-body {
    background-color: #fffdf7;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    background-image: linear-gradient(#e0e0e0 1px, transparent 1px);
    background-size: 100% 2rem;
    line-height: 2rem;
    min-height: 200px;
  }
`

const ReplyButton = styled(S.SubmitButton)`
  background-color: #13cfb8;

  &:hover {
    background-color: #10b8a3;
  }
`
