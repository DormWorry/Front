import Navigation from '@/components/navigation/Navigation'
import styled from 'styled-components'
import Banner from './components/banner'
import AboutUsComponent from './components/intro/aboutus'
import Calendar from './components/calendar'
import FeatureShowcase from './components/feat'
import DeliveryFeat from './components/deliveryFeat'
import LetterFeat from './components/letterFeat'

export default function Onboarding() {
  return (
    <>
      <Navigation />
      <Container>
        <Banner />
        <AboutUsComponent />
        <FeatureShowcase />
        <DeliveryFeat />
        <LetterFeat />
        <Calendar />
      </Container>
    </>
  )
}

const Container = styled.div`
  width: 100vw;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
`
