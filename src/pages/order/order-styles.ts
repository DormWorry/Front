import styled from 'styled-components'

// 메인 컨테이너
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`

// 헤더 영역
export const MainHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  background-color: #f9f9f9;
  border-radius: 12px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

export const PageTitle = styled.h1`
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 700;
  color: #333;
`

export const HeaderDescription = styled.p`
  color: #777;
  text-align: center;
  margin: 0;
  font-size: 16px;
`

// 섹션 관련 스타일
export const SectionHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
`

export const CategorySection = styled.section`
  margin-bottom: 32px;
`

export const RoomsSection = styled.section`
  margin-bottom: 32px;
`

// 주문방 리스트 스타일
export const RoomsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

// 빈 상태 스타일
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background-color: #f9f9f9;
  border-radius: 12px;
  border: 1px dashed #ddd;
`

export const EmptyMessage = styled.p`
  color: #777;
  text-align: center;
  margin-bottom: 20px;
`

// 페이지네이션 스타일
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  gap: 8px;
`

export const PageButton = styled.button<{ isActive?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid ${props => props.isActive ? '#13cfb8' : '#ddd'};
  background-color: ${props => props.isActive ? '#13cfb8' : 'white'};
  color: ${props => props.isActive ? 'white' : '#444'};
  font-weight: ${props => props.isActive ? '600' : 'normal'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.isActive ? '#13cfb8' : '#f5f5f5'};
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #bbb;
    cursor: not-allowed;
    border-color: #eee;
  }
`

export const PageNavButton = styled(PageButton)`
  width: auto;
  padding: 0 12px;
`

export const PageButtonText = styled.span`
  font-size: 14px;
`

// 버튼 스타일
export const CreateRoomButton = styled.button`
  background-color: #13cfb8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 6px rgba(19, 207, 184, 0.2);

  &:hover {
    background-color: #10b9a5;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(19, 207, 184, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(19, 207, 184, 0.2);
  }
`

export const PlusIcon = styled.span`
  font-size: 18px;
  margin-right: 8px;
  font-weight: bold;
`
