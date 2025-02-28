import styled from 'styled-components'
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family:
    var(--font-geist-sans),
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    Fira Sans,
    Droid Sans,
    Helvetica Neue,
    sans-serif;

  @media (max-width: 768px) {
    padding: 16px;
  }
`
export const Header = styled.header`
  padding: 0px;
  background: white;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`

export const WelcomeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #c0f9f3 0%, #13cfb8 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 20px;
    gap: 20px;
  }
`

export const ProfileAndGreeting = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`

export const TimeAndWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  @media (max-width: 480px) {
    align-items: center;
  }
`

export const Greeting = styled.div`
  flex: 1;
`

export const TimeSection = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 180px;
`

export const TimeDisplay = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
    text-align: center;
  }
`

export const DateDisplay = styled.div`
  font-size: 16px;
  color: #555;
  @media (max-width: 480px) {
    text-align: center;
  }
`

export const WelcomeText = styled.div`
  font-size: 22px;
  color: #333;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`

export const UserName = styled.span`
  font-family: 'Pretendard-bold';
  color: black;
`

export const UserLocation = styled.div`
  font-size: 16px;
  color: #666;
`

export const WeatherWidget = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #eeeeee;
  transition: all 0.3s ease;
  min-width: 160px;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`

export const WeatherIcon = styled.div`
  font-size: 36px;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

export const WeatherInfo = styled.div`
  display: flex;
  flex-direction: column;
`

export const WeatherTemp = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin-bottom: 2px;
`

export const WeatherDesc = styled.div`
  font-size: 14px;
  color: #555;
  margin-bottom: 2px;
`

export const WeatherCity = styled.div`
  font-size: 13px;
  color: #777;
  font-weight: 500;
`

export const WeatherLoading = styled.div`
  font-size: 14px;
  color: #666;
  padding: 0 10px;
`

export const WeatherError = styled.div`
  font-size: 14px;
  color: #e74c3c;
  padding: 0 10px;
`

export const ProfileImageWrapper = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }
`

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: 30px;
`

export const ServiceSection = styled.section`
  margin-bottom: 20px;
`

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
  border-left: 4px solid #13cfb8;
  padding-left: 12px;
`

export const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

export const ServiceCard = styled.div`
  display: flex;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  min-height: 120px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }
`

export const ServiceIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  background: #f5f5f5;

  @media (max-width: 480px) {
    width: 70px;
  }
`

export const ServiceIcon = styled.div`
  font-size: 28px;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`

export const ServiceCardContent = styled.div`
  padding: 16px;
  flex: 1;
`

export const ServiceTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`

export const ServiceDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
`

export const QuickInfoSection = styled.section``

export const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const MenuCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`

export const MenuHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f5f5f5;
  gap: 12px;
`

export const MenuIcon = styled.div`
  font-size: 24px;
`

export const MenuTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`

export const MenuContent = styled.div`
  padding: 16px;
`

export const MenuMeal = styled.div`
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`

export const MealType = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 2px 0;
  display: inline-block;
`

export const MealTime = styled.span`
  font-size: 14px;
  color: #777;
  margin-left: 10px;
`

export const MealItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`

export const MealItem = styled.span`
  font-size: 13px;
  color: #555;
  background-color: #f9f9f9;
  padding: 4px 10px;
  border-radius: 30px;
  display: inline-block;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #eee;
  margin: 12px 0;
`
