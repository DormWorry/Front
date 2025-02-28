import React from 'react'
import * as M from '../main-styles'

const MenuSection: React.FC = () => {
  return (
    <M.QuickInfoSection>
      <M.SectionTitle>오늘의 식단</M.SectionTitle>
      <M.MenuGrid>
        <M.MenuCard>
          <M.MenuHeader>
            <M.MenuIcon>🏠</M.MenuIcon>
            <M.MenuTitle>1기숙사 식당</M.MenuTitle>
          </M.MenuHeader>
          <M.MenuContent>
            <M.MenuMeal>
              <M.MealType>아침</M.MealType>
              <M.MealTime>07:30 - 09:00</M.MealTime>
              <M.MealItems>
                <M.MealItem>잡곡밥</M.MealItem>
                <M.MealItem>된장찌개</M.MealItem>
                <M.MealItem>계란말이</M.MealItem>
                <M.MealItem>김치</M.MealItem>
                <M.MealItem>시금치나물</M.MealItem>
              </M.MealItems>
            </M.MenuMeal>
            <M.Divider />
            <M.MenuMeal>
              <M.MealType>저녁</M.MealType>
              <M.MealTime>17:30 - 19:00</M.MealTime>
              <M.MealItems>
                <M.MealItem>잡곡밥</M.MealItem>
                <M.MealItem>제육볶음</M.MealItem>
                <M.MealItem>미역국</M.MealItem>
                <M.MealItem>김치</M.MealItem>
                <M.MealItem>콩나물무침</M.MealItem>
              </M.MealItems>
            </M.MenuMeal>
          </M.MenuContent>
        </M.MenuCard>

        <M.MenuCard>
          <M.MenuHeader>
            <M.MenuIcon>🏫</M.MenuIcon>
            <M.MenuTitle>학생 식당</M.MenuTitle>
          </M.MenuHeader>
          <M.MenuContent>
            <M.MenuMeal>
              <M.MealType>점심</M.MealType>
              <M.MealTime>11:30 - 13:30</M.MealTime>
              <M.MealItems>
                <M.MealItem>백미밥</M.MealItem>
                <M.MealItem>김치찌개</M.MealItem>
                <M.MealItem>불고기</M.MealItem>
                <M.MealItem>김치</M.MealItem>
                <M.MealItem>무말랭이무침</M.MealItem>
              </M.MealItems>
            </M.MenuMeal>
            <M.Divider />
            <M.MenuMeal>
              <M.MealType>저녁</M.MealType>
              <M.MealTime>17:00 - 19:00</M.MealTime>
              <M.MealItems>
                <M.MealItem>백미밥</M.MealItem>
                <M.MealItem>순두부찌개</M.MealItem>
                <M.MealItem>닭갈비</M.MealItem>
                <M.MealItem>김치</M.MealItem>
                <M.MealItem>참나물무침</M.MealItem>
              </M.MealItems>
            </M.MenuMeal>
          </M.MenuContent>
        </M.MenuCard>
      </M.MenuGrid>
    </M.QuickInfoSection>
  )
}

export default MenuSection
