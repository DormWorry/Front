import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { useEffect } from 'react'
import RecoilNexus from 'recoil-nexus'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Firebase CORS 문제 해결을 위한 스크립트 로드
    // 클라이언트 측에서만 실행되도록 함
    if (typeof window !== 'undefined') {
      // Firebase CORS 패치 스크립트 동적 로드
      const script = document.createElement('script');
      script.src = '/firebase/firebaseFix.js';
      script.async = true;
      script.onload = () => console.log('Firebase CORS 패치 스크립트가 로드되었습니다.');
      script.onerror = (e) => console.error('Firebase CORS 패치 스크립트 로드 실패:', e);
      document.head.appendChild(script);
    }
  }, []);

  return (
    <RecoilRoot override={true}>
      <RecoilNexus />
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
