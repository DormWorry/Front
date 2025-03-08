import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { code } = req.query

  try {
    // 코드를 액세스 토큰으로 교환하는 로직
    // const token = await getKakaoToken(code)

    // 토큰으로 사용자 정보 가져오기
    // const userInfo = await getKakaoUserInfo(token)

    // 세션/쿠키 설정 등 로그인 처리
    // ...

    // 홈페이지로 리다이렉트
    res.redirect('/')
  } catch (error) {
    console.error('Kakao OAuth 에러:', error)
    res.redirect('/login?error=auth_failed')
  }
}
