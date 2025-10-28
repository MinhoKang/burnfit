// 특정 월의 일수를 계산
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// 월 이름 포맷팅
export const formatMonthYear = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

// 오늘 날짜 확인
export const checkIsToday = (
  day: number,
  currentMonth: number,
  currentYear: number,
): boolean => {
  const today = new Date();
  return (
    day > 0 &&
    day < 100 &&
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear()
  );
};
