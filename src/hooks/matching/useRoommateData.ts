import { useState, useEffect } from 'react'
import { RoommateProfile, RoommateType } from '../../pages/matching/types'
import roommateApi from '../../api/roommate'
import { AxiosError } from 'axios'

interface UseRoommateDataProps {
  preferredType?: number
}

export const useRoommateData = ({
  preferredType,
}: UseRoommateDataProps = {}) => {
  const [profiles, setProfiles] = useState<RoommateProfile[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // 프로필 데이터 로드
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true)
        const data = await roommateApi.getProfiles({ preferredType })
        setProfiles(data)
        setError(null)
      } catch (err: unknown) {
        console.error('룸메이트 프로필 로드 실패:', err)
        // 더 자세한 에러 정보 출력
        if (err instanceof AxiosError) {
          if (err.response) {
            console.error('에러 응답:', err.response.data)
            console.error('에러 상태:', err.response.status)
            console.error('에러 헤더:', err.response.headers)
          } else if (err.request) {
            console.error('요청은 전송되었지만 응답을 받지 못함:', err.request)
          } else {
            console.error('에러 메시지:', err.message)
          }
        }
        setError('프로필을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [preferredType])

  // 프로필 생성 함수
  const createProfile = async (profileData: {
    myPersonalityTypeId: number
    preferredPersonalityTypeId: number
    description: string
    kakaoId: string
    instagram: string
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
        .getProfiles({ preferredType })
        .then((data) => setProfiles(data))
        .catch((err) => {
          console.error('프로필 새로고침 실패:', err)
          setError('프로필을 새로고침하는 중 오류가 발생했습니다.')
        })
    },
  }
}
