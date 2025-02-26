import Navigation from '@/components/navigation/Navigation'
import styled from 'styled-components'
import Banner from './components/banner'
import AboutUsComponent from './components/intro/aboutus'
export default function Onboarding() {
  return (
    <>
      <Navigation />
      <Container>
        <Banner />
        <AboutUsComponent />
      </Container>
    </>
  )
}

const Container = styled.div`
  width: 100vw;
  margin: 0 auto;
  overflow-y: auto;
`
