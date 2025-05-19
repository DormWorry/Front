// Firebase CORS 문제 해결을 위한 패치 파일
(function() {
  // 원본 fetch 함수 저장
  const originalFetch = window.fetch;
  
  // fetch를 재정의하여 Firebase 요청의 credentials 모드를 'omit'으로 변경
  window.fetch = function(url, options) {
    // Firebase 요청인지 확인
    if (typeof url === 'string' && url.includes('firestore.googleapis.com')) {
      console.log('[FirebaseFix] Firebase 요청 감지:', url);
      
      // options가 undefined인 경우 빈 객체로 초기화
      options = options || {};
      
      // credentials 모드를 'omit'으로 변경
      options.credentials = 'omit';
      
      console.log('[FirebaseFix] credentials 모드 변경됨:', options.credentials);
    }
    
    // 원본 fetch 호출
    return originalFetch.apply(this, arguments);
  };
  
  console.log('[FirebaseFix] Firebase CORS 패치가 적용되었습니다.');
})();
