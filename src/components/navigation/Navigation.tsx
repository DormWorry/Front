import React, { useState } from 'react'
import styled from 'styled-components'

const Nav = styled.nav`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 50px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0px 20px;
  }
`

const Logo = styled.img`
  height: 35px;
  align-self: center;
`

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: white;
    padding: 20px;
    gap: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${({ isOpen }) => isOpen ? 1 : 0};
    visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease-in-out;
    z-index: 10;
  }
`

const NavLink = styled.div`
  font-size: 1rem;
  font-family: 'Pretendard-bold';
  cursor: pointer;
  &:hover {
    color: #00bfa5;
  }
`

const Button = styled.button`
  width: 150px;
  height: 40px;
  font-size: 15px;
  font-family: 'Pretendard-bold';
  background-color: #13cfb8;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #00bfa5;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;

  @media (max-width: 768px) {
    display: block;
  }
`

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Nav>
      <Logo src="/logo.png" alt="Logo" />
      <MobileMenuButton onClick={toggleMenu}>
        {isMenuOpen ? '✕' : '☰'}
      </MobileMenuButton>
      <NavLinks isOpen={isMenuOpen}>
        <NavLink>홈</NavLink>
        <NavLink>서비스 소개</NavLink>
        <NavLink>주요 기능</NavLink>
        <Button>회원가입 / 로그인</Button>
      </NavLinks>
    </Nav>
  )
}

export default Navigation
