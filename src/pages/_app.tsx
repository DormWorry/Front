import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot override={true}>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
