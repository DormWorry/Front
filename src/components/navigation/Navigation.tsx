import React from 'react'
import styled from 'styled-components'

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 50px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const Logo = styled.img`
  height: 35px;
  align-self: center;
`

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
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
`

const Navigation: React.FC = () => {
  return (
    <Nav>
      <Logo src="/logo.png" alt="Logo" />
      <NavLinks>
        <NavLink>홈</NavLink>
        <NavLink>서비스 소개</NavLink>
        <NavLink>주요 기능</NavLink>
        <Button>회원가입 / 로그인</Button>
      </NavLinks>
    </Nav>
  )
}

export default Navigation
