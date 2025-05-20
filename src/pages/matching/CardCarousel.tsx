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
import GoBackIcon from '../../assets/icons/goBackIcon.svg'

// 기숙사 ID를 이름으로 변환하는 함수
const getDormitoryName = (dormitoryId: string | undefined): string => {
  if (!dormitoryId) return '기숙사 정보 없음'

  switch (dormitoryId) {
    case '1':
      return '제 1기숙사'
    case '2':
      return '제 2기숙사'
    case '3':
      return '제 3기숙사'
    default:
      return `기숙사 ${dormitoryId}`
  }
}

// 유형 ID를 유형 이름으로 변환하는 함수
const getPersonalityTypeInfo = (typeId: number | string | undefined) => {
  if (!typeId)
    return { title: '성격 유형 정보 없음', traits: [], description: '' }

  const id = typeof typeId === 'string' ? parseInt(typeId) : typeId

  // roommateTypes.ts에서 가져온 유형 데이터
  switch (id) {
    case 1:
      return {
        title: '부지런한 깔끔쟹이',
        traits: [
          '아침형 인간 🌅',
          '깔끔쟹이 🧹',
          '잠귀 밝음 🔔',
          '정리정돈 필수 📏',
          '조용한 환경 선호 🤫',
        ],
        description:
          '깔끼하고 규칙적인 생활을 추구하는 타입입니다. 조용하고 정돈된 환경에서 생활하기를 선호합니다.',
        emoji: '🧹',
      }
    case 2:
      return {
        title: '자유로운 밤샘러',
        traits: [
          '밤샘형 인간 🌙',
          '자유로운 스타일 😎',
          '소음 무관 🔊',
          '방에서 주로 생활 🏠',
          '야식 자주 먹음 🍜',
        ],
        description:
          '자유로운 라이프스타일을 가진 야행성 타입입니다. 룸메이트의 생활 패턴에 크게 구애받지 않습니다.',
        emoji: '🌙',
      }
    case 3:
      return {
        title: '사교적인 활동러',
        traits: [
          '아침형 인간 🌅',
          '운동하는 타입 🏋️‍♂️',
          '친해지고 싶음 💬',
          '함께 밥 먹는 거 좋아함 🍽️',
          '청소 루틴 있음 🗓️',
        ],
        description:
          '활발하고 사교적인 성격으로, 룸메이트와 함께하는 활동을 즐기는 타입입니다.',
        emoji: '🏋️‍♂️',
      }
    case 4:
      return {
        title: '조용한 독서가',
        traits: [
          '아침형 인간 🌅',
          '책 읽는 걸 좋아함 📚',
          '잠귀 밝음 🔔',
          '각자 생활 선호 🚪',
          '깔끔한 식사 선호 🍽️',
        ],
        description:
          '조용하고 독립적인 생활을 즐기는 타입입니다. 서로의 프라이버시를 존중하는 것을 중요시합니다.',
        emoji: '📚',
      }
    case 5:
      return {
        title: '밤샘형 넷플릭스 매니아',
        traits: [
          '밤샘형 인간 🌙',
          '넷플릭스/유튜브 매니아 📺',
          '이어폰 필수 🎧',
          '샤워 오래 하는 편 🚿⏳',
          '시끄러운 소음 X 🚫',
        ],
        description:
          '밤늦게까지 영상 시청을 즐기지만, 타인에 대한 배려도 갖춘 타입입니다.',
        emoji: '📺',
      }
    case 6:
      return {
        title: '독립적인 미니멀리스트',
        traits: [
          '아침형 인간 🌅',
          '최소한의 대화 🤝',
          '깔끔한 🧹',
          '방에서 주로 생활 🏠',
          '택배 거의 안 시킵니다 📦❌',
        ],
        description:
          '심플하고 독립적인 라이프스타일을 추구하며, 불필요한 소통과 물건을 최소화하는 타입입니다.',
        emoji: '🧘‍♂️',
      }
    case 7:
      return {
        title: '게임러 야식러',
        traits: [
          '밤샘형 인간 🌙',
          '게임러 🎮',
          '야식 자주 먹음 🍜',
          '이어폰 필수 🎧',
          '적당히 정리하는 편 🏡',
        ],
        description:
          '게임을 즐기고 야식을 좋아하지만, 타인을 배려할 줄 아는 타입입니다.',
        emoji: '🎮',
      }
    case 8:
      return {
        title: '소셜 네트워커',
        traits: [
          '아침형 인간 🌅',
          '사교적인 성격 🗣️',
          '친구 자주 초대함 🏡',
          '함께 밥 먹는 거 좋아함 🍽️',
          '외출 많은 편 🚶‍♂️',
        ],
        description:
          '활발한 사회생활을 즐기며, 룸메이트와도 친밀한 관계를 형성하고 싶어하는 타입입니다.',
        emoji: '🤝',
      }
    case 9:
      return {
        title: '집중이 필요한 공부러',
        traits: [
          '아침형 인간 🌅',
          '잠귀 밝음 🔔',
          '조용한 환경 필수 🤫',
          '정리정돈 필수 📏',
          '시끄러운 소음 X 🚫',
        ],
        description:
          '학업에 집중하기 위해 조용하고 정돈된 환경을 필요로 하는 타입입니다.',
        emoji: '📚',
      }
    default:
      return {
        title: `유형 ${id}`,
        traits: [`성격 트레이트 정보 (유형 ${id})`],
        description: `이 유형(${id})은 다른 사람들과의 색다른 성격과 특성을 가지고 있습니다.`,
        emoji: '😊',
      }
  }
}

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
    // preferredType이 아닌 현재 사용자가 선택한 유형(myPersonalityTypeId)을 가진 드로리로 찾기
    myPersonalityTypeId: selectedType?.id,
  }) || { profiles: [], loading: false, error: null }

  // 디버깅용 로그
  useEffect(() => {
    if (profiles.length > 0) {
      console.log('매칭된 프로필:', profiles)
      console.log('첫 번째 프로필 정보:', {
        userId: profiles[0].userId,
        myPersonalityTypeId: profiles[0].myPersonalityTypeId,
        preferredPersonalityTypeId: profiles[0].preferredPersonalityTypeId,
        dormitoryId: profiles[0].dormitoryId,
        dormitory: profiles[0].dormitory,
        myPersonalityType: profiles[0].myPersonalityType,
      })
    }
  }, [profiles])

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
                {/* 기숙사 ID 대신 실제 기숙사 이름 표시 */}
                <DormitoryBadge>
                  {profile.dormitory?.name ||
                    getDormitoryName(profile.dormitoryId)}
                </DormitoryBadge>
              </RoommateInfo>

              <IntroText>
                {profile.introduction || '소개글이 없습니다.'}
              </IntroText>

              <PersonalityTypeContainer>
                {/* 실제 유형 정보 표시 */}
                <TypeHeader>
                  <TypeEmoji>
                    {profile.myPersonalityType?.emoji ||
                      getPersonalityTypeInfo(profile.myPersonalityTypeId)
                        ?.emoji}
                  </TypeEmoji>
                  <TypeName>
                    {profile.myPersonalityType?.title ||
                      `${getPersonalityTypeInfo(profile.myPersonalityTypeId)?.title}`}
                  </TypeName>
                </TypeHeader>

                <TypeTraits>
                  {profile.myPersonalityType?.traits
                    ? profile.myPersonalityType.traits
                        .slice(0, 3)
                        .map((trait, index) => (
                          <TraitTag key={index}>{trait}</TraitTag>
                        ))
                    : getPersonalityTypeInfo(profile.myPersonalityTypeId)
                        ?.traits.slice(0, 3)
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
                {/* 기숙사명이 없으면 ID를 기숙사 이름으로 변환하여 표시 */}
                {selectedProfile.dormitory?.name ||
                  getDormitoryName(selectedProfile.dormitoryId)}
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
                    getPersonalityTypeInfo(selectedProfile.myPersonalityTypeId)
                      ?.emoji}
                </TypeEmoji>
                <TypeName>
                  {selectedProfile.myPersonalityType?.title ||
                    getPersonalityTypeInfo(selectedProfile.myPersonalityTypeId)
                      ?.title}
                </TypeName>
              </TypeHeader>

              <TypeTraits>
                {selectedProfile.myPersonalityType?.traits
                  ? selectedProfile.myPersonalityType.traits.map(
                      (trait, index) => (
                        <TraitTag key={index}>{trait}</TraitTag>
                      ),
                    )
                  : getPersonalityTypeInfo(
                      selectedProfile.myPersonalityTypeId,
                    )?.traits.map((trait, index) => (
                      <TraitTag key={index}>{trait}</TraitTag>
                    ))}
              </TypeTraits>

              <p
                style={{ marginTop: '15px', fontSize: '0.9rem', color: '#555' }}
              >
                {/* 유형 설명 정보 */}
                {selectedProfile.myPersonalityType?.description ||
                  getPersonalityTypeInfo(selectedProfile.myPersonalityTypeId)
                    ?.description ||
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
