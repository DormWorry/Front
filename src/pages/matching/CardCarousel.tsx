import React, { useState } from 'react';
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
    ContactInfo
} from './styles';

const CardCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const cards = [
        {
            id: 1,
            name: "김철수",
            role: "대학생",
            image: "/path/to/image1.jpg",
            description: "안녕하세요! 저는 24살 대학생입니다. 청결하고 규칙적인 생활을 하는 것을 좋아합니다. 취미는 독서와 요리입니다.",
            contact: {
                phone: "+123-456-7890",
                email: "example1@email.com",
                location: "서울시 강남구"
            }
        },
        {
            id: 2,
            name: "이영희",
            role: "대학원생",
            image: "/path/to/image2.jpg",
            description: "대학원에서 컴퓨터공학을 전공중입니다. 밤늦게까지 공부하는 편이에요. 조용하고 깔끔한 환경을 선호합니다.",
            contact: {
                phone: "+123-456-7891",
                email: "example2@email.com",
                location: "서울시 서초구"
            }
        },
        {
            id: 3,
            name: "박민준",
            role: "직장인",
            image: "/path/to/image3.jpg",
            description: "IT 회사에서 일하는 27살 직장인입니다. 주말에는 운동하는 것을 좋아하고, 평일에는 규칙적으로 생활합니다.",
            contact: {
                phone: "+123-456-7892",
                email: "example3@email.com",
                location: "서울시 송파구"
            }
        },
        {
            id: 4,
            name: "정수아",
            role: "프리랜서",
            image: "/path/to/image4.jpg",
            description: "재택근무를 하는 디자이너입니다. 창의적인 작업을 위해 조용한 환경을 선호해요. 고양이와 함께 살고 있습니다.",
            contact: {
                phone: "+123-456-7893",
                email: "example4@email.com",
                location: "서울시 마포구"
            }
        },
        {
            id: 5,
            name: "최준호",
            role: "대학생",
            image: "/path/to/image5.jpg",
            description: "체육교육과 3학년입니다. 운동을 좋아하고 활발한 성격이에요. 청소와 정리정돈을 잘하는 편입니다.",
            contact: {
                phone: "+123-456-7894",
                email: "example5@email.com",
                location: "서울시 관악구"
            }
        },
        {
            id: 6,
            name: "한지민",
            role: "직장인",
            image: "/path/to/image6.jpg",
            description: "은행에서 일하는 26살입니다. 아침형 인간이라 일찍 자고 일찍 일어나요. 주말에는 요가와 필라테스를 즐깁니다.",
            contact: {
                phone: "+123-456-7895",
                email: "example6@email.com",
                location: "서울시 영등포구"
            }
        }
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
                        <ProfileImage>
                            <img src={card.image} alt={card.name} />
                        </ProfileImage>
                        <CardContent>
                            <Name>{card.name}</Name>
                            <Role>{card.role}</Role>
                            <Description>{card.description}</Description>
                            <ContactInfo>
                                <div>📞 {card.contact.phone}</div>
                                <div>📧 {card.contact.email}</div>
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
        </Container>
    );
};

export default CardCarousel;
