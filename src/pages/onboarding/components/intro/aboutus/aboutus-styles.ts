import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  position: relative;
  background: #ffffff;

  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    padding: 60px 16px;
  }
`

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 60px;
  width: 100%;
  position: relative;
  z-index: 2;
  min-height: 30vh;

  @media (max-width: 768px) {
    margin-bottom: 40px;
    min-height: auto;
  }
`

export const IntroGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  will-change: opacity, transform;
`

export const ThinkingIcon = styled.img`
  width: 48px;
  height: 48px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    margin-bottom: 16px;
  }
`

export const IntroTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  margin: 0;
  line-height: 1.4;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`

export const IntroDescription = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #666;
  max-width: 800px;
  text-align: center;
  margin: 0;
  will-change: opacity, transform;

  @media (max-width: 768px) {
    font-size: 16px;
    max-width: 100%;
    padding: 0 10px;
  }
`

export const ServicesGrid = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 50px;
  position: relative;
  z-index: 2;
  min-height: 60vh;

  @media (max-width: 768px) {
    gap: 30px;
    min-height: auto;
  }
`

export const TopServiceRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 30px;
  will-change: opacity, transform;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    margin-bottom: 0;
    gap: 30px;
  }
`

export const BottomServiceRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  width: 100%;
  will-change: opacity, transform;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }

  @media (max-width: 768px) {
    & > div {
      width: 100%;
    }
  }
`
