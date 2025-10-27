// 특정 월의 일수를 계산
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// 캘린더 매트릭스 생성
export const generateCalendarMatrix = (
  year: number,
  month: number,
): number[][] => {
  const firstDay = new Date(year, month, 1).getDay();
  const maxDays = getDaysInMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const totalCells = firstDay + maxDays;
  const weeksNeeded = Math.ceil(totalCells / 7);

  const dateRows = Array.from({ length: weeksNeeded }, (_, rowIndex) => {
    return Array.from({ length: 7 }, (_, colIndex) => {
      const dayNumber = rowIndex * 7 + colIndex - firstDay + 1;

      if (dayNumber < 1) {
        return -(prevMonthDays + dayNumber);
      }
      if (dayNumber > maxDays) {
        return 100 + (dayNumber - maxDays);
      }
      return dayNumber;
    });
  });

  return dateRows;
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
