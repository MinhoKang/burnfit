import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  findTargetWeekIndex,
  generateCalendarMatrix,
} from '../../helpers/calendar';
import { formatMonthYear } from '../../utils/date';

type CalendarMode = 'month' | 'week';
export type CalendarMatrix = number[][];

export type UseCalendarLogicReturn = {
  /** 현재 캘린더 모드 ('month' | 'week') */
  mode: CalendarMode;
  /** 현재 화면에 보이는 기준 날짜 (월 또는 주의 대표 날짜) */
  viewMonth: Date;
  /** 사용자가 마지막으로 탭(선택)한 날짜 */
  selectedDate: Date;

  /** (주간 모드) 이전 캘린더의 주 인덱스 */
  prevWeekIndex: number;
  /** (주간 모드) 다음 캘린더의 주 인덱스 */
  nextWeekIndex: number;

  // --- 상태 변경 함수 ---
  /** 캘린더 모드를 'month' 또는 'week'로 변경 */
  switchMode: (newMode: CalendarMode) => void;
  /** (월간 모드) 헤더 버튼으로 월을 변경 */
  changeMonth: (direction: number) => void;
  /** (주간 모드) 헤더 버튼 또는 스와이프로 주를 변경 */
  changeWeek: (direction: number) => void;
  /** 날짜 타일을 탭했을 때 호출 */
  selectDate: (day: number) => void;

  // --- 계산된 데이터 ---
  /** * 스와이프 애니메이션을 위한 3개의 달력 매트릭스
   * (mode에 따라 월/주 데이터가 동적으로 계산됨)
   */
  matrices: {
    prev: CalendarMatrix;
    current: CalendarMatrix;
    next: CalendarMatrix;
  };
  /** 렌더링 시 '다른 달' 날짜를 식별하기 위한 Date 객체들 */
  dateHelpers: {
    prevMonthDate: Date;
    nextMonthDate: Date;
    prevWeekDate: Date;
    nextWeekDate: Date;
  };

  /** 현재 선택된 날짜의 주를 찾는 함수 */
  selectedWeekIndex: number;

  /** 헤더에 표시될 "October 2025" 형태의 문자열 */
  headerText: string;
};

const TODAY = new Date();

export const useCalendarLogic = (
  initialDate = TODAY,
): UseCalendarLogicReturn => {
  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  // 현재 보여지는 월
  const [viewMonth, setViewMonth] = useState<Date>(initialDate);
  // 주력, 월력 모드
  const [mode, setMode] = useState<CalendarMode>('month');

  // 주력, 월력 모드 전환
  const switchMode = (newMode: CalendarMode) => {
    setMode(newMode);
  };

  // 헤더 버튼(월력)
  const changeMonth = useCallback(
    (direction: number) => {
      const newDate = new Date(viewMonth);
      newDate.setMonth(viewMonth.getMonth() + direction);
      setViewMonth(newDate);
    },
    [viewMonth],
  );

  // 헤더 버튼(주력)
  const changeWeek = useCallback(
    (direction: number) => {
      const newDate = new Date(viewMonth);
      newDate.setDate(viewMonth.getDate() + direction * 7);
      setViewMonth(newDate);
    },
    [viewMonth],
  );

  // 날짜 타일 탭
  const selectDate = useCallback(
    (day: number) => {
      const newDate = new Date(viewMonth);

      // 이전 달의 날짜를 선택한 경우
      if (day < 0) {
        // 이전 달로 변경
        newDate.setMonth(viewMonth.getMonth() - 1);
        // 선택한 날짜로 변경
        newDate.setDate(-day);

        // 다음 달의 날짜를 선택한 경우
      } else if (day > 100) {
        // 다음 달로 변경
        newDate.setMonth(viewMonth.getMonth() + 1);
        // 선택한 날짜로 변경
        newDate.setDate(day - 100);

        // 현재 달의 날짜를 선택한 경우
      } else {
        // 선택한 날짜로 변경
        newDate.setDate(day);
      }
      setSelectedDate(newDate);
      // 날짜 선택 시 해당 날짜가 포함된 월/주로 뷰를 이동
      setViewMonth(newDate);
    },
    [viewMonth],
  );

  // 이전/다음 달 (월력)
  const prevMonthDate = useMemo(() => {
    const date = new Date(viewMonth);
    date.setMonth(viewMonth.getMonth() - 1);
    return date;
  }, [viewMonth]);

  const nextMonthDate = useMemo(() => {
    const date = new Date(viewMonth);
    date.setMonth(viewMonth.getMonth() + 1);
    return date;
  }, [viewMonth]);

  // 이전/다음 주 (주력)
  const prevWeekDate = useMemo(() => {
    const date = new Date(viewMonth);
    date.setDate(viewMonth.getDate() - 7);
    return date;
  }, [viewMonth]);

  const nextWeekDate = useMemo(() => {
    const date = new Date(viewMonth);
    date.setDate(viewMonth.getDate() + 7);
    return date;
  }, [viewMonth]);

  // 모드에 따라 다른 매트릭스 사용
  const prevMatrix = useMemo(
    () =>
      mode === 'week'
        ? generateCalendarMatrix(
            prevWeekDate.getFullYear(),
            prevWeekDate.getMonth(),
          )
        : generateCalendarMatrix(
            prevMonthDate.getFullYear(),
            prevMonthDate.getMonth(),
          ),
    [mode, prevWeekDate, prevMonthDate],
  );
  const currentMatrix = useMemo(
    () => generateCalendarMatrix(viewMonth.getFullYear(), viewMonth.getMonth()),
    [viewMonth],
  );
  const nextMatrix = useMemo(
    () =>
      mode === 'week'
        ? generateCalendarMatrix(
            nextWeekDate.getFullYear(),
            nextWeekDate.getMonth(),
          )
        : generateCalendarMatrix(
            nextMonthDate.getFullYear(),
            nextMonthDate.getMonth(),
          ),
    [mode, nextWeekDate, nextMonthDate],
  );
  // 현재 선택된 날짜의 주를 찾는 함수
  const selectedWeekIndex = useMemo(() => {
    const targetDate = mode === 'week' ? viewMonth : selectedDate;
    return findTargetWeekIndex(currentMatrix, targetDate);
  }, [mode, viewMonth, selectedDate, currentMatrix]);

  const prevWeekIndex = useMemo(() => {
    // 월간 모드일 때는 값이 무의미하므로 0 반환
    if (mode === 'month') return 0;

    return findTargetWeekIndex(prevMatrix, prevWeekDate);
  }, [mode, prevWeekDate, prevMatrix]);

  const nextWeekIndex = useMemo(() => {
    // 월간 모드일 때는 값이 무의미하므로 0 반환
    if (mode === 'month') return 0;

    return findTargetWeekIndex(nextMatrix, nextWeekDate);
  }, [mode, nextWeekDate, nextMatrix]);

  // 헤더 텍스트
  const headerText = useMemo(() => formatMonthYear(viewMonth), [viewMonth]);

  // '주' 모드로 전환 시, 'viewMonth'를 'selectedDate'로 동기화
  useEffect(() => {
    if (mode === 'week') {
      setViewMonth(selectedDate);
    }
  }, [mode, selectedDate]);

  return {
    // 상태
    mode,
    viewMonth,
    selectedDate,

    prevWeekIndex,
    nextWeekIndex,

    // 상태 변경 함수
    switchMode,
    changeMonth,
    changeWeek,
    selectDate,

    // 계산된 데이터
    matrices: {
      prev: prevMatrix,
      current: currentMatrix,
      next: nextMatrix,
    },
    // 렌더링 시 필요한 날짜 객체들
    dateHelpers: {
      prevMonthDate,
      nextMonthDate,
      prevWeekDate,
      nextWeekDate,
    },
    selectedWeekIndex,
    headerText,
  };
};
