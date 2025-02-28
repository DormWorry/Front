import { useCarousel } from '../../hooks/useCarousel';
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
    TypeDescription
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

    return (
        <Container>
            <CarouselContainer style={isMobile ? { transformStyle: 'flat' } : undefined}>
                {cardData.map((card, index) => (
                    <Card
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        style={getCardStyle(index)}
                    >
                        <ProfileImage>
                            <img src={card.image} alt={card.name} />
                        </ProfileImage>
                        <CardContent>
                            <Name>{card.name}</Name>
                            <Role>{card.role}</Role>
                            <Description>{card.description}</Description>
                            <ContactInfo>
                                <div>💬 {card.contact.kakaoId}</div>
                                <div>👤 {card.contact.instagram}</div>
                                <div>📍 {card.contact.location}</div>
                            </ContactInfo>
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
                        <TypeDescription>{selectedType.description}</TypeDescription>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default CardCarousel;
