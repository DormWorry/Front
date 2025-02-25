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
  gap: 30px;
`

export const CarouselContainer = styled.div`
  position: relative;
  width: 400px;
  height: 200px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Card = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  background: #52c0f5;
  color: white;
  font-family: sans-serif;
  font-size: 12px;
  text-transform: uppercase;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease;
  backface-visibility: hidden;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`

export const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
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
