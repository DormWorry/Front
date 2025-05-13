import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// 백엔드 API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://port-0-capstoneserver-m6xxoqjg3249c6c2.sel4.cloudtype.app';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST 요청만 처리
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 요청 바디 검증
    const { code, redirectUri } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Missing code parameter' });
    }

    console.log('Proxying kakao token request');
    console.log('Code:', code.substring(0, 10) + '...');
    console.log('Redirect URI:', redirectUri);
    
    // 백엔드 서버로 요청 전달
    const response = await axios.post(
      `${API_BASE_URL}/auth/kakao/token`, 
      { code, redirectUri },
      { 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    );

    // 백엔드 응답을 클라이언트에 전달
    return res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    
    // 에러 처리 및 응답
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorData = error.response?.data || { message: 'Internal Server Error' };
      
      console.error('Error details:', {
        status: statusCode,
        data: errorData,
        headers: error.response?.headers
      });
      
      return res.status(statusCode).json(errorData);
    }
    
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
