import { useEffect } from 'react';
import { useCarousel } from '../../hooks/useCarousel';
import { useCredits } from '../../hooks/matching/useCredits';
import { useRoommateData } from '../../hooks/matching/useRoommateData';
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
    CreditInfo,
    LoadingContainer,
    ErrorMessage
} from './styles';
import { RoommateProfile, RoommateType } from './types';

interface Props {
    selectedType: RoommateType;
}

const CardCarousel = ({ selectedType }: Props) => {
    // 백엔드에서 프로필 데이터 가져오기
    const { profiles, loading, error } = useRoommateData({
        preferredType: selectedType?.id // 사용자가 선택한 유형으로 정렬
    });

    const {
        activeIndex,
        selectedCard,
        isMobile,
        handlePrevClick,
        handleNextClick,
        handleCardClick,
        handleCloseModal,
        getCardStyle,
        setTotalCards
    } = useCarousel(profiles.length || 0);

    // 총 카드 수 업데이트
    useEffect(() => {
        if (profiles.length > 0) {
            setTotalCards(profiles.length);
        }
    }, [profiles.length, setTotalCards]);

    // 크레딧 시스템 훅 사용
    const { credits, useCredit, isRevealed } = useCredits();
    
    // 크레딧 사용 핸들러
    const handleUseCredit = (profileId: number | string | null) => {
        if (profileId) {
            useCredit(profileId);
        }
    };

    // 모바일일 때만 화면에 표시될 카드를 필터링하는 함수
    const getCardsToRender = () => {
        if (!profiles.length) return [];

        if (!isMobile) {
            return profiles;
        }

        // 모바일인 경우: 현재 카드 및 전후 카드만 표시
        const visibleRange = 1; // 현재 카드 기준으로 양쪽으로 보여줄 카드 수
        return profiles.filter((_, index) =>
            Math.abs(index - activeIndex) <= visibleRange ||
            (activeIndex === 0 && index === profiles.length - 1) ||
            (activeIndex === profiles.length - 1 && index === 0)
        );
    };

    // 프로필 찾는 함수 추가
    const findSelectedProfile = (profiles: RoommateProfile[], selectedCardId: string | number | null) => {
        if (!selectedCardId) return null;
        return profiles.find(profile => profile.id === String(selectedCardId));
    };

    // 로딩 중일 때
    if (loading) {
        return (
            <LoadingContainer>
                <h3>룸메이트 프로필을 불러오는 중...</h3>
                <p>잠시만 기다려주세요.</p>
            </LoadingContainer>
        );
    }

    // 오류 발생 시
    if (error) {
        return (
            <ErrorMessage>
                <h3>오류가 발생했습니다</h3>
                <p>{error}</p>
                <Button onClick={() => window.location.reload()}>다시 시도</Button>
            </ErrorMessage>
        );
    }

    // 프로필이 없는 경우
    if (profiles.length === 0) {
        return (
            <Container>
                <h3>아직 등록된 룸메이트 프로필이 없습니다</h3>
                <p>첫 번째 프로필을 등록해보세요!</p>
            </Container>
        );
    }

    return (
        <Container>
            <CarouselContainer style={isMobile ? { transformStyle: 'flat' } : undefined}>
                {getCardsToRender().map((profile) => (
                    <Card
                        key={profile.id}
                        onClick={() => handleCardClick(profile.id)}
                        style={getCardStyle(profiles.findIndex(p => p.id === profile.id))}
                    >
                        <ProfileImage>
                            <img src="/user.png" alt={profile.user?.nickname || '사용자'} />
                        </ProfileImage>
                        <CardContent>
                            <Name>{profile.user?.nickname || '사용자'}</Name>
                            <Role>
                                {profile.dormitory?.name || profile.dormitoryId}
                            </Role>
                            <Description>{profile.description}</Description>
                            <TypeTitle style={{ fontSize: '1rem', paddingTop: '10px', marginBottom: '5px' }}>
                                <TypeEmoji style={{ fontSize: '1.2rem' }}>
                                    {profile.myPersonalityType?.emoji || selectedType.emoji}
                                </TypeEmoji>
                                {profile.myPersonalityType?.title || selectedType.title}
                            </TypeTitle>
                            <TypeDescription style={{ fontSize: '0.7rem', margin: '0', maxHeight: '60px', overflow: 'hidden' }}>
                                {profile.myPersonalityType?.description || selectedType.description}
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
                        <h2>
                            {findSelectedProfile(profiles, selectedCard)?.user?.nickname || '사용자'}님의 성격 유형
                        </h2>
                        <TypeTitle>
                            <TypeEmoji>
                                {findSelectedProfile(profiles, selectedCard)?.myPersonalityType?.emoji || selectedType.emoji}
                            </TypeEmoji>
                            {findSelectedProfile(profiles, selectedCard)?.myPersonalityType?.title || selectedType.title}
                        </TypeTitle>
                        <TraitList>
                            {(findSelectedProfile(profiles, selectedCard)?.myPersonalityType?.traits || selectedType.traits).map((trait, index) => (
                                <Trait key={index}>{trait}</Trait>
                            ))}
                        </TraitList>

                        <ContactInfo>
                            {!isRevealed(selectedCard) && (
                                <CreditButton
                                    onClick={() => handleUseCredit(selectedCard)}
                                    disabled={credits <= 0}
                                >
                                    크레딧 사용하기
                                </CreditButton>
                            )}
                            <BlurredGroup isBlurred={!isRevealed(selectedCard)}>
                                <div>💬 카카오: {findSelectedProfile(profiles, selectedCard)?.kakaoId}</div>
                                <div>👤 인스타: {findSelectedProfile(profiles, selectedCard)?.instagram}</div>
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