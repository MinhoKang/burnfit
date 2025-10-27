export const isOtherMonthDay = (day: number | string): boolean => {
  return typeof day === 'number' && (day < 0 || day > 100);
};

export const getDisplayDay = (day: number | string): number | string => {
  if (typeof day !== 'number') return day;
  if (day < 0) return -day;
  if (day > 100) return day - 100;
  return day;
};
