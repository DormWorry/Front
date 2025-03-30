/**
 * ISO 형식의 날짜 문자열을 사용자 친화적인 형식으로 변환합니다.
 * @param dateString ISO 형식의 날짜 문자열 (예: "2023-05-15T14:30:00Z")
 * @param format 날짜 포맷 (기본값: 'YYYY.MM.DD HH:mm')
 * @returns 사용자 친화적인 날짜 문자열 (예: "2023.05.15 14:30")
 */
export function formatDate(dateString: string, format: string = 'YYYY.MM.DD HH:mm'): string {
  const date = new Date(dateString);
  
  // 유효하지 않은 날짜인 경우 원본 문자열 반환
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  // 한국 시간대로 변환 (UTC+9)
  const koreaTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  
  const year = koreaTime.getUTCFullYear();
  const month = String(koreaTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(koreaTime.getUTCDate()).padStart(2, '0');
  const hours = String(koreaTime.getUTCHours()).padStart(2, '0');
  const minutes = String(koreaTime.getUTCMinutes()).padStart(2, '0');
  
  if (format === 'YYYY.MM.DD') {
    return `${year}.${month}.${day}`;
  }
  
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

/**
 * 날짜를 상대적인 형식으로 표시합니다. (예: "3일 전", "방금 전")
 * @param dateString ISO 형식의 날짜 문자열
 * @returns 상대적인 날짜 문자열
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  // 유효하지 않은 날짜인 경우 원본 문자열 반환
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return '방금 전';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }
  
  // 7일이 지나면 날짜 형식으로 표시
  return formatDate(dateString);
}
