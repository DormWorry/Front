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
      {categories.map((category) => {
        const isSelected = category.id === selectedCategory
        return (
          <CategoryItem
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            isSelected={isSelected}
          >
            <CategoryIconWrapper isSelected={isSelected}>
              <CategoryIcon isSelected={isSelected}>{category.icon}</CategoryIcon>
            </CategoryIconWrapper>
            <CategoryLabel isSelected={isSelected}>
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

const CategoryItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  cursor: pointer;
  border-radius: 12px;
  background-color: ${(props) => (props.isSelected ? '#E8F9F7' : 'white')};
  border: ${(props) =>
    props.isSelected ? '2px solid #13CFB8' : '1px solid #e0e0e0'};
  box-shadow: ${(props) =>
    props.isSelected ? '0 6px 12px rgba(19, 207, 184, 0.15)' : 'none'};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-3px);
    background-color: ${(props) => (props.isSelected ? '#E8F9F7' : '#f9f9f9')};
    border-color: ${(props) => (props.isSelected ? '#13CFB8' : '#13CFB8')};
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
  }
`

const CategoryIconWrapper = styled.div<{ isSelected: boolean }>`
  background-color: ${(props) => (props.isSelected ? '#13CFB8' : '#f5f5f5')};
  width: 50px;
  height: 50px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  transition: all 0.2s ease;
  border: 1px solid ${(props) => (props.isSelected ? '#13CFB8' : '#e0e0e0')};
`

const CategoryIcon = styled.div<{ isSelected: boolean }>`
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.isSelected ? 'white' : '#000000')};
`

const CategoryLabel = styled.div<{ isSelected: boolean }>`
  font-size: 14px;
  margin-top: 4px;
  font-weight: ${(props) => (props.isSelected ? '600' : '500')};
  color: ${(props) => (props.isSelected ? '#13CFB8' : '#333333')};
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
