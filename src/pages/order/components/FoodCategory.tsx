import React from 'react'
import styled from 'styled-components'

export interface FoodCategoryType {
  id: string
  name: string
  icon: string
}

interface FoodCategoryProps {
  categories: FoodCategoryType[]
  onSelectCategory: (categoryId: string) => void
  selectedCategory: string | null
}

const FoodCategory: React.FC<FoodCategoryProps> = ({
  categories,
  onSelectCategory,
  selectedCategory,
}) => {
  return (
    <CategoryContainer>
      {categories && categories.length > 0 && categories.map((category) => {
        const isSelected = category.id === selectedCategory
        return (
          <CategoryItem
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            $isSelected={isSelected}
          >
            <CategoryIconWrapper $isSelected={isSelected}>
              <CategoryIcon $isSelected={isSelected}>{category.icon}</CategoryIcon>
            </CategoryIconWrapper>
            <CategoryLabel $isSelected={isSelected}>
              {category.name}
            </CategoryLabel>
            {isSelected && <SelectedIndicator />}
          </CategoryItem>
        )
      })}
    </CategoryContainer>
  )
}

const CategoryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
`

const CategoryItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding: 16px 8px;
  border-radius: 12px;
  background-color: ${({ $isSelected }) => $isSelected ? '#F0FBF9' : 'transparent'};
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: ${({ $isSelected }) => $isSelected ? '#F0FBF9' : '#f7f7f7'};
    transform: translateY(-2px);
  }
`

const CategoryIconWrapper = styled.div<{ $isSelected: boolean }>`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({ $isSelected }) => $isSelected ? '#13cfb8' : '#f3f4f6'};
  margin-bottom: 12px;
  transition: background-color 0.2s;
`

const CategoryIcon = styled.div<{ $isSelected: boolean }>`
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $isSelected }) => $isSelected ? 'white' : '#000000'};
`

const CategoryLabel = styled.div<{ $isSelected: boolean }>`
  font-size: 14px;
  margin-top: 4px;
  font-weight: ${({ $isSelected }) => $isSelected ? '600' : '500'};
  color: ${({ $isSelected }) => $isSelected ? '#13CFB8' : '#333333'};
`

const SelectedIndicator = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 15px;
  height: 15px;
  background-color: #13CFB8;
  border-radius: 50%;
  border: 2px solid white;
`

export default FoodCategory
