import { OrderRoomType } from '../pages/order/order-types'

export const getMockRooms = (): OrderRoomType[] => {
  return [
    {
      id: 'room-1',
      restaurantName: '맛있는 치킨',
      minOrderAmount: 18000,
      deliveryFee: 3000,
      categoryId: 'chicken',
      participants: [
        { id: 'user-2', name: '이멋사' },
        { id: 'user-3', name: '권멋사' },
      ],
      createdAt: new Date().toISOString(),
      createdBy: 'user-2',
      description: '양념 반 프라이드 반 시키려고 합니다. 같이 주문하실 분?',
    },
    {
      id: 'room-2',
      restaurantName: '피자헛',
      minOrderAmount: 25000,
      deliveryFee: 4000,
      categoryId: 'pizza',
      participants: [{ id: 'user-4', name: '최멋사' }],
      createdAt: new Date().toISOString(),
      createdBy: 'user-4',
    },
    {
      id: 'room-3',
      restaurantName: '스타벅스',
      minOrderAmount: 15000,
      deliveryFee: 3500,
      categoryId: 'cafe-dessert',
      participants: [
        { id: 'user-5', name: '정멋사' },
        { id: 'user-6', name: '한멋사' },
        { id: 'user-7', name: '장멋사' },
      ],
      createdAt: new Date().toISOString(),
      createdBy: 'user-5',
      description: '카페인 충전이 필요해요. 아메리카노 모임!',
    },

    {
      id: 'room-4',
      restaurantName: '스타벅스',
      minOrderAmount: 15000,
      deliveryFee: 3500,
      categoryId: 'cafe-dessert',
      participants: [
        { id: 'user-5', name: '정멋사' },
        { id: 'user-6', name: '한멋사' },
        { id: 'user-7', name: '장멋사' },
      ],
      createdAt: new Date().toISOString(),
      createdBy: 'user-5',
      description: '카페인 충전이 필요해요. 아메리카노 모임!',
    },

    {
      id: 'room-5',
      restaurantName: '스타벅스',
      minOrderAmount: 15000,
      deliveryFee: 3500,
      categoryId: 'cafe-dessert',
      participants: [
        { id: 'user-5', name: '정멋사' },
        { id: 'user-6', name: '한멋사' },
        { id: 'user-7', name: '장멋사' },
      ],
      createdAt: new Date().toISOString(),
      createdBy: 'user-5',
      description: '카페인 충전이 필요해요. 아메리카노 모임!',
    },

    {
      id: 'room-6',
      restaurantName: '스타벅스',
      minOrderAmount: 15000,
      deliveryFee: 3500,
      categoryId: 'cafe-dessert',
      participants: [
        { id: 'user-5', name: '정멋사' },
        { id: 'user-6', name: '한멋사' },
        { id: 'user-7', name: '장멋사' },
      ],
      createdAt: new Date().toISOString(),
      createdBy: 'user-5',
      description: '카페인 충전이 필요해요. 아메리카노 모임!',
    },

    {
      id: 'room-7',
      restaurantName: '스타벅스',
      minOrderAmount: 15000,
      deliveryFee: 3500,
      categoryId: 'cafe-dessert',
      participants: [
        { id: 'user-5', name: '정멋사' },
        { id: 'user-6', name: '한멋사' },
        { id: 'user-7', name: '장멋사' },
      ],
      createdAt: new Date().toISOString(),
      createdBy: 'user-5',
      description: '카페인 충전이 필요해요. 아메리카노 모임!',
    },

    {
      id: 'room-8',
      restaurantName: '스타벅스',
      minOrderAmount: 15000,
      deliveryFee: 3500,
      categoryId: 'cafe-dessert',
      participants: [
        { id: 'user-5', name: '정멋사' },
        { id: 'user-6', name: '한멋사' },
        { id: 'user-7', name: '장멋사' },
      ],
      createdAt: new Date().toISOString(),
      createdBy: 'user-5',
      description: '카페인 충전이 필요해요. 아메리카노 모임!',
    },

    {
      id: 'room-9',
      restaurantName: '스타벅스',
      minOrderAmount: 15000,
      deliveryFee: 3500,
      categoryId: 'cafe-dessert',
      participants: [
        { id: 'user-5', name: '정멋사' },
        { id: 'user-6', name: '한멋사' },
        { id: 'user-7', name: '장멋사' },
      ],
      createdAt: new Date().toISOString(),
      createdBy: 'user-5',
      description: '카페인 충전이 필요해요. 아메리카노 모임!',
    },
  ]
}
