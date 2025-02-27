import React from 'react'
import * as S from '../letter-styles'
import { ProfileProps } from '../types'

/**
 * 사용자 프로필 사이드바 컴포넌트
 */
const ProfileSidebar: React.FC<ProfileProps> = ({
  roomNumber,
  userName,
  avatarSrc,
  onComposeClick,
  onImageError,
  imageError,
}) => {
  return (
    <S.ProfileContainer>
      <S.Avatar>
        {!imageError ? (
          <S.AvatarImage
            src={avatarSrc}
            alt="사용자 프로필"
            onError={onImageError}
          />
        ) : (
          <div
            style={{ fontSize: '24px', fontWeight: 'bold', color: '#666' }}
          >
            {roomNumber.replace(/[^0-9]/g, '')}
          </div>
        )}
      </S.Avatar>
      <S.RoomNumber>{roomNumber}</S.RoomNumber>
      <S.UserName>{userName}</S.UserName>
      <S.ActionButton onClick={onComposeClick}>
        편지 쓰기
      </S.ActionButton>
    </S.ProfileContainer>
  )
}

export default ProfileSidebar
