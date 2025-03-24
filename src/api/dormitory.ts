import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const dormitoryApi = {
  /**
   * 모든 기숙사 정보를 가져옵니다.
   */
  getAllDormitories: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/dormitories`);
      return response.data.dormitories;
    } catch (error) {
      console.error('기숙사 정보 가져오기 실패:', error);
      throw error;
    }
  },
};

export default dormitoryApi;
