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
