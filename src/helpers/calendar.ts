import { getDaysInMonth } from '../utils/date';

export const isOtherMonthDay = (day: number | string): boolean => {
  return typeof day === 'number' && (day < 0 || day > 100);
};

export const getDisplayDay = (day: number | string): number | string => {
  if (typeof day !== 'number') return day;
  if (day < 0) return -day;
  if (day > 100) return day - 100;
  return day;
};

// 선택된 날짜인지 확인
export const checkIsSelectedDay = (
  day: number,
  viewMonth: Date,
  selectedDate: Date,
): boolean => {
  if (day < 0) {
    // 이전 달 날짜
    const prevMonth = new Date(viewMonth);
    prevMonth.setMonth(viewMonth.getMonth() - 1);
    return (
      -day === selectedDate.getDate() &&
      prevMonth.getMonth() === selectedDate.getMonth() &&
      prevMonth.getFullYear() === selectedDate.getFullYear()
    );
  }

  if (day > 100) {
    // 다음 달 날짜
    const nextMonth = new Date(viewMonth);
    nextMonth.setMonth(viewMonth.getMonth() + 1);
    return (
      day - 100 === selectedDate.getDate() &&
      nextMonth.getMonth() === selectedDate.getMonth() &&
      nextMonth.getFullYear() === selectedDate.getFullYear()
    );
  }

  // 현재 달 날짜
  return (
    day === selectedDate.getDate() &&
    viewMonth.getMonth() === selectedDate.getMonth() &&
    viewMonth.getFullYear() === selectedDate.getFullYear()
  );
};

export const generateWeekCalendarMatrix = (date: Date): number[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // 선택된 날짜가 속한 주의 일요일 찾기
  const currentDate = new Date(year, month, day);
  const dayOfWeek = currentDate.getDay();
  const sundayDate = new Date(currentDate);
  sundayDate.setDate(day - dayOfWeek);

  // 일주일 생성
  const week = Array.from({ length: 7 }, (_, index) => {
    const weekDate = new Date(sundayDate);
    weekDate.setDate(sundayDate.getDate() + index);

    const weekDay = weekDate.getDate();
    const weekMonth = weekDate.getMonth();

    // 다른 달이면 음수 또는 100+ 처리
    if (weekMonth < month) {
      return -weekDay;
    }
    if (weekMonth > month) {
      return 100 + weekDay;
    }
    return weekDay;
  });

  return week;
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
    return Array.from({ length: 7 }, (__, colIndex) => {
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

// 타겟 날짜의 주 인덱스를 찾는 함수
export const findTargetWeekIndex = (
  matrix: number[][],
  targetDate: Date,
): number => {
  const targetDay = targetDate.getDate();
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
    const row = matrix[rowIndex];
    for (const day of row) {
      if (day === targetDay) {
        return rowIndex;
      }
    }
  }
  return 0;
};
