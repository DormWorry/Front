import React, { useState } from 'react';
import { Container, CarouselContainer, Card, Button, ButtonContainer } from './styles';

const CardCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const cards = [
        { id: 1, text: 'First Card' },
        { id: 2, text: 'Second Card' },
        { id: 3, text: 'Third Card' },
        { id: 4, text: 'Fourth Card' },
        { id: 5, text: 'Fifth Card' }
    ];

    const handlePrevClick = () => {
        setActiveIndex((current) => (current - 1 + cards.length) % cards.length);
    };

    const handleNextClick = () => {
        setActiveIndex((current) => (current + 1) % cards.length);
    };

    return (
        <Container>
            <CarouselContainer>
                {cards.map((card, index) => (
                    <Card
                        key={card.id}
                        style={{
                            transform: `rotateY(${(index - activeIndex) * 60}deg) translateZ(300px)`,
                            opacity: index === activeIndex ? 1 : 0.5
                        }}
                    >
                        {card.text}
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
        </Container>
    );
};

export default CardCarousel;
