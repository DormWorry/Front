import React, { useEffect, useState } from 'react'
import { useCredits } from '../../hooks/matching/useCredits'
import { useRoommateData } from '../../hooks/matching/useRoommateData'
import roommateApi from '../../api/roommate'
import { RoommateProfile, RoommateType } from './types'
import {
  // 컴포넌트 모듈에서 필요한 컴포넌트들 가져오기
  Button,
  ErrorMessage,
  WaitingContainer,
  SpinnerContainer,
  WaitingSpinner,
  NoMatchContainer,
  ButtonGroup,
  ActionButton,
  SecondaryButton as ComponentSecondaryButton,
  Container,
} from '../../components/matching/components'
import {
  MatchingResultContainer,
  SectionHeader,
  MainTitle,
  SubTitle,
  FilterContainer,
  FilterButton,
  CardsGrid,
  RoommateCard,
  CardHeader,
  CardPattern,
  ProfileImageContainer,
  ProfileImg,
  CardBody,
  RoommateInfo,
  RoommateName,
  DormitoryBadge,
  IntroText,
  PersonalityTypeContainer,
  TypeHeader,
  TypeEmoji,
  TypeName,
  TypeTraits,
  TraitTag,
  CardFooter,
  ContactButton,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
  ModalSubTitle,
  DetailSection,
  SectionTitle,
  ContactSection,
  ContactItem,
  ContactIcon,
  ContactText,
  LoadingContainer,
  WaitingSpinnerContainer,
  Spinner,
  ActionButtonsContainer,
  PrimaryButton,
  SecondaryButton,
  NavButtonContainer,
  NavButton,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateText,
  EmptyStateSubText,
  NoMoreCard,
} from './matchingCardStyles'

interface Props {
  selectedType: RoommateType
}

const CardCarousel = ({ selectedType }: Props) => {
  // 매칭 대기 상태 관리
  const [isWaiting, setIsWaiting] = useState<boolean>(true)
  const [noMatchFound, setNoMatchFound] = useState<boolean>(false)
  const [selectedProfile, setSelectedProfile] =
    useState<RoommateProfile | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filteredProfiles, setFilteredProfiles] = useState<RoommateProfile[]>(
    [],
  )
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [showContactInfo, setShowContactInfo] = useState<
    Record<string, boolean>
  >({})

  // 백엔드에서 프로필 데이터 가져오기
  const {
    profiles = [],
    loading,
    error,
  } = useRoommateData({
    preferredType: selectedType?.id, // 사용자가 선택한 유형으로 정렬
  }) || { profiles: [], loading: false, error: null }

  // 크레딧 시스템 훅 사용
  const { credits, useCredit, isRevealed } = useCredits()

  // 프로필이 없을 때 10초 대기 후 매칭 실패 메시지 표시
  useEffect(() => {
    if (!loading && profiles.length === 0) {
      setIsWaiting(true)
      const timer = setTimeout(() => {
        setIsWaiting(false)
        setNoMatchFound(true)
      }, 10000) // 10초 대기

      return () => clearTimeout(timer)
    } else {
      setIsWaiting(false)
      setNoMatchFound(false)
      // 초기 필터링된 프로필 설정
      setFilteredProfiles(profiles)
    }
  }, [loading, profiles])

  // 필터 변경 시 프로필 필터링
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    setCurrentPage(1)

    if (filter === 'all') {
      setFilteredProfiles(profiles)
    } else if (filter === 'dormitory') {
      // 같은 기숙사 필터링
      const currentUserDorm = profiles.find((p) => p.dormitory)?.dormitory?.id
      setFilteredProfiles(
        profiles.filter((p) => p.dormitory?.id === currentUserDorm),
      )
    } else if (filter === 'recent') {
      // 최근 추가된 순으로 정렬
      setFilteredProfiles(
        [...profiles].sort((a, b) => {
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          )
        }),
      )
    }
  }

  // 프로필 상세 보기
  const handleViewProfile = (profile: RoommateProfile) => {
    setSelectedProfile(profile)
  }

  // 모달 닫기
  const handleCloseModal = () => {
    setSelectedProfile(null)
  }

  // 연락처 정보 확인 시 크레딧 사용
  const handleContactReveal = (profileId: string) => {
    useCredit(profileId)
    setShowContactInfo((prev) => ({
      ...prev,
      [profileId]: true,
    }))
  }

  // 홈으로 돌아가기
  const handleGoHome = () => {
    window.location.href = '/main'
  }

  // 다시 검색하기
  const handleRetry = () => {
    setIsWaiting(true)
    setNoMatchFound(false)

    // 프로필 새로 불러오기
    roommateApi
      .getProfiles({ preferredType: selectedType?.id })
      .then((newProfiles) => {
        if (newProfiles && newProfiles.length > 0) {
          setIsWaiting(false)
          setFilteredProfiles(newProfiles)
        } else {
          setTimeout(() => {
            setIsWaiting(false)
            setNoMatchFound(true)
          }, 10000)
        }
      })
      .catch((err) => {
        console.error('API 호출 오류:', err)
        setIsWaiting(false)
        setNoMatchFound(true)
      })
  }

  // 로딩 중일 때
  if (loading) {
    return (
      <LoadingContainer>
        <h3>룸메이트 프로필을 불러오는 중...</h3>
        <p>잠시만 기다려주세요.</p>
      </LoadingContainer>
    )
  }

  // 오류 발생 시
  if (error) {
    return (
      <ErrorMessage>
        <h3>오류가 발생했습니다</h3>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>다시 시도</Button>
      </ErrorMessage>
    )
  }

  // 대기 중인 경우
  if (isWaiting && profiles.length === 0) {
    return (
      <WaitingContainer>
        <h3>룸메이트 매칭을 기다리고 있어요</h3>
        <p>매칭되는 룸메이트를 찾고 있습니다...</p>
        <SpinnerContainer>
          <WaitingSpinner />
        </SpinnerContainer>
      </WaitingContainer>
    )
  }

  // 매칭을 찾지 못한 경우
  if (noMatchFound && profiles.length === 0) {
    return (
      <NoMatchContainer>
        <h3>적합한 룸메이트를 찾지 못했어요</h3>
        <p>아직 현재 유형에 매칭되는 룸메이트가 없습니다. 다시 시도해보세요.</p>
        <ButtonGroup>
          <ActionButton onClick={handleRetry}>다시 검색하기</ActionButton>
          <ComponentSecondaryButton onClick={handleGoHome}>
            홈으로 돌아가기
          </ComponentSecondaryButton>
        </ButtonGroup>
      </NoMatchContainer>
    )
  }

  // 프로필이 없는 경우 (대기 상태가 아닐 때)
  if (profiles.length === 0) {
    return (
      <Container>
        <h3>아직 등록된 룸메이트 프로필이 없습니다</h3>
        <p>첫 번째 프로필을 등록해보세요!</p>
      </Container>
    )
  }

  return (
    <MatchingResultContainer>
      {/* 하나로 통합된 헤더 + 홈으로 가는 버튼 */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          padding: '0 20px',
          marginBottom: '20px',
        }}
      >
        <SectionHeader style={{ flex: 1 }}>
          {/* 필터 버튼들 */}
          <div
            style={{
              marginTop: '15px',
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
            }}
          >
            <FilterButton
              active={activeFilter === 'all'}
              onClick={() => handleFilterChange('all')}
            >
              전체보기
            </FilterButton>
            <FilterButton
              active={activeFilter === 'dormitory'}
              onClick={() => handleFilterChange('dormitory')}
            >
              같은 기숙사
            </FilterButton>
            <FilterButton
              active={activeFilter === 'recent'}
              onClick={() => handleFilterChange('recent')}
            >
              최근 추가된 순
            </FilterButton>
          </div>
        </SectionHeader>
      </div>

      {/* 카드 그리드 */}
      <CardsGrid>
        {filteredProfiles.map((profile) => (
          <RoommateCard
            key={profile.id}
            onClick={() => handleViewProfile(profile)}
          >
            <CardHeader>
              <CardPattern />
            </CardHeader>

            <ProfileImageContainer>
              <ProfileImg
                src="/user.png"
                alt={profile.user?.nickname || '사용자'}
              />
            </ProfileImageContainer>

            <CardBody>
              <RoommateInfo>
                <RoommateName>
                  {profile.user?.nickname || '사용자'}
                </RoommateName>
                <DormitoryBadge>
                  {profile.dormitory?.name || '기숙사 정보 없음'}
                </DormitoryBadge>
              </RoommateInfo>

              <IntroText>
                {profile.introduction || '소개글이 없습니다.'}
              </IntroText>

              <PersonalityTypeContainer>
                <TypeHeader>
                  <TypeEmoji>
                    {profile.myPersonalityType?.emoji ||
                      selectedType?.emoji ||
                      '😊'}
                  </TypeEmoji>
                  <TypeName>
                    {profile.myPersonalityType?.title ||
                      selectedType?.title ||
                      '성격 유형'}
                  </TypeName>
                </TypeHeader>

                <TypeTraits>
                  {(
                    profile.myPersonalityType?.traits ||
                    selectedType?.traits ||
                    []
                  )
                    .slice(0, 3)
                    .map((trait, index) => (
                      <TraitTag key={index}>{trait}</TraitTag>
                    ))}
                </TypeTraits>
              </PersonalityTypeContainer>
            </CardBody>

            <CardFooter>
              {/* 연락처보기 버튼이 가려지지 않도록 줄바꿈 제거 */}
              <ContactButton
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isRevealed(profile.id)) {
                    handleContactReveal(profile.id)
                  }
                }}
                style={{ padding: '12px', fontSize: '0.95rem' }}
              >
                {isRevealed(profile.id)
                  ? '연락처 보기'
                  : `연락처 보기 (${credits})`}
              </ContactButton>
            </CardFooter>
          </RoommateCard>
        ))}
      </CardsGrid>

      {/* 상세 보기 모달 */}
      {selectedProfile && (
        <ModalBackdrop onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton onClick={handleCloseModal}>
              &times;
            </ModalCloseButton>

            <ModalHeader>
              <ModalTitle>
                {selectedProfile.user?.nickname || '사용자'} 님의 프로필
              </ModalTitle>
              <ModalSubTitle>
                {selectedProfile.dormitory?.name || '기숙사 정보 없음'}
              </ModalSubTitle>
            </ModalHeader>

            <DetailSection>
              <SectionTitle>소개</SectionTitle>
              <p>{selectedProfile.introduction || '소개글이 없습니다.'}</p>
            </DetailSection>

            <DetailSection>
              <SectionTitle>성격 유형</SectionTitle>
              <TypeHeader>
                <TypeEmoji>
                  {selectedProfile.myPersonalityType?.emoji ||
                    selectedType?.emoji ||
                    '😊'}
                </TypeEmoji>
                <TypeName>
                  {selectedProfile.myPersonalityType?.title ||
                    selectedType?.title ||
                    '성격 유형'}
                </TypeName>
              </TypeHeader>

              <TypeTraits>
                {(
                  selectedProfile.myPersonalityType?.traits ||
                  selectedType?.traits ||
                  []
                ).map((trait, index) => (
                  <TraitTag key={index}>{trait}</TraitTag>
                ))}
              </TypeTraits>

              <p
                style={{ marginTop: '15px', fontSize: '0.9rem', color: '#555' }}
              >
                {selectedProfile.myPersonalityType?.description ||
                  selectedType?.description ||
                  '유형 설명이 없습니다.'}
              </p>
            </DetailSection>

            {isRevealed(selectedProfile.id) && (
              <ContactSection>
                <SectionTitle>연락처 정보</SectionTitle>
                {selectedProfile.kakaoTalkId && (
                  <ContactItem>
                    <ContactIcon>💬</ContactIcon>
                    <ContactText>
                      KakaoTalk: {selectedProfile.kakaoTalkId}
                    </ContactText>
                  </ContactItem>
                )}
                {selectedProfile.instagramId && (
                  <ContactItem>
                    <ContactIcon>👤</ContactIcon>
                    <ContactText>
                      Instagram: {selectedProfile.instagramId}
                    </ContactText>
                  </ContactItem>
                )}
              </ContactSection>
            )}

            {!isRevealed(selectedProfile.id) && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <ContactButton
                  onClick={() => handleContactReveal(selectedProfile.id)}
                >
                  연락처 보기 ({credits} 크레딧)
                </ContactButton>
              </div>
            )}
          </ModalContent>
        </ModalBackdrop>
      )}
    </MatchingResultContainer>
  )
}

export default CardCarousel
