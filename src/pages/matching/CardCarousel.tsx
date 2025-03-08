import { useState, useEffect } from 'react';
import { useCarousel } from '../../hooks/useCarousel';
import { useCredits } from '../../hooks/useCredits';
import {
    Container,
    CarouselContainer,
    Card,
    Button,
    ButtonContainer,
    ProfileImage,
    CardContent,
    Name,
    Role,
    Description,
    ContactInfo,
    ModalOverlay,
    ModalContent,
    ModalClose,
    TypeTitle,
    TypeEmoji,
    TraitList,
    Trait,
    TypeDescription,
    BlurredGroup,
    CreditButton,
    CreditInfo
} from './styles';
import { cardData } from './cardData';
import { RoommateType } from './types';

interface Props {
    selectedType: RoommateType;
}

const CardCarousel = ({ selectedType }: Props) => {
    const {
        activeIndex,
        selectedCard,
        isMobile,
        handlePrevClick,
        handleNextClick,
        handleCardClick,
        handleCloseModal,
        getCardStyle
    } = useCarousel(cardData.length);

    // 크레딧 시스템 훅 사용
    const { credits, useCredit, isRevealed } = useCredits();

    // 모바일일 때만 화면에 표시될 카드를 필터링하는 함수
    const getCardsToRender = () => {
        if (!isMobile) {
            return cardData;
        }

        // 모바일인 경우: 현재 카드 및 전후 카드만 표시
        const visibleRange = 1; // 현재 카드 기준으로 양쪽으로 보여줄 카드 수
        return cardData.filter((_, index) =>
            Math.abs(index - activeIndex) <= visibleRange ||
            (activeIndex === 0 && index === cardData.length - 1) ||
            (activeIndex === cardData.length - 1 && index === 0)
        );
    };

    return (
        <Container>
            <CarouselContainer style={isMobile ? { transformStyle: 'flat' } : undefined}>
                {getCardsToRender().map((card) => (
                    <Card
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        style={getCardStyle(cardData.findIndex(c => c.id === card.id))}
                    >
                        <ProfileImage>
                            <img src={card.image} alt={card.name} />
                        </ProfileImage>
                        <CardContent>
                            <Name>{card.name}</Name>
                            <Role>{card.role}</Role>
                            <Description>{card.description}</Description>
                            <TypeTitle style={{ fontSize: '1rem', paddingTop: '10px', marginBottom: '5px' }}>
                                <TypeEmoji style={{ fontSize: '1.2rem' }}>{selectedType.emoji}</TypeEmoji>
                                {selectedType.title}
                            </TypeTitle>
                            <TypeDescription style={{ fontSize: '0.7rem', margin: '0', maxHeight: '60px', overflow: 'hidden' }}>
                                {selectedType.description}
                            </TypeDescription>
                        </CardContent>
                    </Card>
                ))}
            </CarouselContainer>
            <ButtonContainer>
                <Button onClick={handlePrevClick}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Button>
                <Button onClick={handleNextClick}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Button>
            </ButtonContainer>

            {selectedCard && (
                <ModalOverlay onClick={handleCloseModal}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <ModalClose onClick={handleCloseModal}>&times;</ModalClose>
                        <h2>{cardData.find(card => card.id === selectedCard)?.name}님의 성격 유형</h2>
                        <TypeTitle>
                            <TypeEmoji>{selectedType.emoji}</TypeEmoji>
                            {selectedType.title}
                        </TypeTitle>
                        <TraitList>
                            {selectedType.traits.map((trait, index) => (
                                <Trait key={index}>{trait}</Trait>
                            ))}
                        </TraitList>

                        <ContactInfo>
                            {!isRevealed(selectedCard) && (
                                <CreditButton
                                    onClick={() => useCredit(selectedCard)}
                                    disabled={credits <= 0}
                                >
                                    크레딧 1개 사용하기
                                </CreditButton>
                            )}
                            <BlurredGroup isBlurred={!isRevealed(selectedCard)}>
                                <div>💬 카카오: {cardData.find(card => card.id === selectedCard)?.contact.kakaoId}</div>
                                <div>👤 인스타: {cardData.find(card => card.id === selectedCard)?.contact.instagram}</div>
                                <div>📍 {cardData.find(card => card.id === selectedCard)?.contact.location}</div>


                            </BlurredGroup>
                        </ContactInfo>

                        <CreditInfo>
                            남은 크레딧: <span>{credits}개</span>
                        </CreditInfo>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default CardCarousel;