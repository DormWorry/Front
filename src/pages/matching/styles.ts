import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  gap: 50px;
`

export const CarouselContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
`

export const Card = styled.div`
  position: absolute;
  width: 280px;
  height: 300px;
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
  backface-visibility: hidden;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`

export const ProfileImage = styled.div`
  position: absolute;
  top: -60px;
  width: 100px;
  height: 100px;
  background: #f0f0f0;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 4px solid white;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const CardContent = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 20px;
`

export const Name = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 5px;
`

export const Role = styled.div`
  font-size: 1rem;
  color: #666;
  background: #e8f0fe;
  padding: 5px 15px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 15px;
`

export const Description = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
  text-align: left;
  padding: 0 10px;
`

export const ContactInfo = styled.div`
  width: 100%;
  font-size: 0.8rem;
  color: #888;
  text-align: left;
  padding: 0 10px;

  div {
    margin: 5px 0;
  }
`

export const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  position: relative;
  z-index: 1;
`

export const Button = styled.button<{ left?: boolean; right?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f0f0;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`
