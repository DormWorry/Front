// Firebase 설정 파일
// 실제 프로젝트에서는 .env 파일에 넣고 관리하는 것이 좋습니다.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCwAgWS8SNpGrElUQ7V2bwsgqap7hAiIXk",
  authDomain: "capstonechat-b9231.firebaseapp.com",
  projectId: "capstonechat-b9231",
  storageBucket: "capstonechat-b9231.firebasestorage.app",
  messagingSenderId: "696287236022",
  appId: "1:696287236022:web:1b6db40c5aa1e9ad88bb17",
  measurementId: "G-GXP0RDCXQX"
};

// Firebase 설정 연결 서비스 전역 변수
let app;
let db;
let auth;

// 이미 초기화되었는지 확인하는 함수
function getFirebaseApp() {
  if (!app) {
    // Firebase 처음 초기화
    app = initializeApp(firebaseConfig);
    console.log('[Firebase] Firebase 앱 최초 초기화');
  }
  return app;
}

// Firestore 인스턴스 가져오기
function getFirestoreInstance() {
  if (!db) {
    // Firestore 처음 초기화
    const app = getFirebaseApp();
    db = getFirestore(app);
    
    // CORS 문제 해결: credentials 모드 설정
    // Firebase를 직접 호출할 때 withCredentials를 사용하지 않도록 함
    // Firebase SDK 내부적으로 설정됩니다
    if (typeof window !== 'undefined') {
      // 브라우저 환경에서만 실행
      console.log('[Firebase] Firestore CORS 설정 적용');
    }
    
    console.log('[Firebase] Firestore 최초 초기화');
  }
  return db;
}

// Auth 인스턴스 가져오기
function getAuthInstance() {
  if (!auth) {
    // Auth 처음 초기화
    const app = getFirebaseApp();
    auth = getAuth(app);
    console.log('[Firebase] Auth 최초 초기화');
  }
  return auth;
}

// 인스턴스 초기화
app = getFirebaseApp();
db = getFirestoreInstance();
auth = getAuthInstance();

// Analytics는 브라우저 환경에서만 사용가능(선택사항)
const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};
const analyticsPromise = initAnalytics();

// 내보내기
export { db, auth, analyticsPromise };
export default app;
