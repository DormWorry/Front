import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
`

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 60px;
  width: 100%;
`

export const IntroGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`

export const ThinkingIcon = styled.img`
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
`

export const IntroTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  margin: 0;
  line-height: 1.4;
  text-align: center;
`

export const IntroDescription = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #666;
  max-width: 800px;
  text-align: center;
  margin: 0;
`

export const ServicesGrid = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 50px;
`

export const TopServiceRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

export const BottomServiceRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  width: 100%;
`
