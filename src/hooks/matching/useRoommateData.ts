import { useState, useEffect } from 'react'
import { RoommateProfile, RoommateType } from '../../pages/matching/types'
import roommateApi from '../../api/roommate'
import { useRecoilValue } from 'recoil'
import { userAtom } from '../../atoms/userAtom'

interface UseRoommateDataProps {
  preferredType?: number
  myPersonalityTypeId?: number
  dormitoryId?: string
}

export const useRoommateData = ({
  preferredType,
  myPersonalityTypeId,
  dormitoryId,
}: UseRoommateDataProps = {}) => {
  const [profiles, setProfiles] = useState<RoommateProfile[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const currentUser = useRecoilValue(userAtom)

  // 프로필 데이터 로드
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true)
        console.log('API 요청 매개변수:', { myPersonalityTypeId, preferredType, dormitoryId })
        
        // API 호출 시 필터 옵션 전달
        const data = await roommateApi.getProfiles({
          myPersonalityTypeId,
          preferredType,
          dormitoryId
        })
        
        // 자신의 프로필은 매칭 결과에서 제외
        let filteredProfiles = data
        if (currentUser?.id) {
          filteredProfiles = data.filter(profile => 
            String(profile.userId) !== String(currentUser.id)
          )
          console.log('자신의 프로필을 제외한 매칭 결과:', filteredProfiles.length, '개')
          console.log('현재 사용자 ID:', currentUser.id)
          console.log('필터링된 프로필 IDs:', filteredProfiles.map(p => p.userId))
        } else {
          console.log('현재 사용자 정보가 없습니다. 필터링을 건너뜁니다.')
        }
        
        setProfiles(filteredProfiles)
        setError(null)
      } catch (err) {
        console.error('룸메이트 프로필 로드 실패:', err)
        setError('프로필을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [preferredType, myPersonalityTypeId, dormitoryId, currentUser?.id])

  // 프로필 생성 함수
  const createProfile = async (profileData: {
    myPersonalityTypeId: number
    preferredPersonalityTypeId: number
    introduction: string  // description이 아닌 introduction으로 수정
    kakaoTalkId: string   // kakaoId가 아닌 kakaoTalkId로 수정
    instagramId: string  // instagram이 아닌 instagramId로 수정
    dormitoryId: string
  }) => {
    try {
      setLoading(true)
      const newProfile = await roommateApi.createProfile(profileData)

      // 새 프로필을 추가하고 리스트를 업데이트합니다
      setProfiles((prev) => [...prev, newProfile])

      return newProfile
    } catch (err) {
      console.error('프로필 생성 실패:', err)
      setError('프로필을 생성하는 중 오류가 발생했습니다.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    profiles,
    loading,
    error,
    createProfile,
    refreshProfiles: () => {
      roommateApi
        .getProfiles({ 
          preferredType,
          myPersonalityTypeId,
          dormitoryId 
        })
        .then((data) => {
          // 자신의 프로필은 매칭 결과에서 제외
          let filteredProfiles = data
          if (currentUser?.id) {
            filteredProfiles = data.filter(profile => 
              String(profile.userId) !== String(currentUser.id)
            )
          }
          setProfiles(filteredProfiles)
        })
        .catch((err) => {
          console.error('프로필 새로고침 실패:', err)
          setError('프로필을 새로고침하는 중 오류가 발생했습니다.')
        })
    },
  }
}
