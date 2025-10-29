import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  withTiming,
  SharedValue,
  Extrapolation,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Gesture } from 'react-native-gesture-handler';
import { UseCalendarLogicReturn } from './useCalendarLogic';

const CALENDAR_HEIGHT_MONTH = 300;
const CALENDAR_HEIGHT_WEEK = 60;
const ROW_HEIGHT = 50;
const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 800;
const DAMPING = 20;
const STIFFNESS = 90;

const useAnimatedRowStyle = (
  rowIndex: number,
  selectedWeekIndex: number, // JS 스레드
  dragProgress: SharedValue<number>, // UI 스레드
) => {
  const style = useAnimatedStyle(() => {
    if (rowIndex === selectedWeekIndex) {
      return { height: ROW_HEIGHT, opacity: 1, overflow: 'hidden' };
    }

    const rowHeight = interpolate(
      dragProgress.value,
      [0, 1],
      [ROW_HEIGHT, 0],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      dragProgress.value,
      [0, 0.5, 1],
      [1, 0.5, 0],
      Extrapolation.CLAMP,
    );
    return { height: rowHeight, opacity, overflow: 'hidden' };
  }, [selectedWeekIndex]);

  return style;
};

export const useCalendarAnimation = (logic: UseCalendarLogicReturn) => {
  const {
    mode,
    viewMonth,
    selectedWeekIndex,
    switchMode,
    changeMonth,
    changeWeek,
  } = logic;
  const { width } = Dimensions.get('window');

  const calendarHeight = useSharedValue(CALENDAR_HEIGHT_MONTH);
  const dragProgress = useSharedValue(0); // 0: month, 1: week
  const translateX = useSharedValue(-width);

  // 전체 캘린더 컨테이너 높이 애니메이션
  const animatedCalendarContainerStyle = useAnimatedStyle(() => {
    return {
      height: calendarHeight.value,
      overflow: 'hidden',
    };
  });

  // 좌우 스와이프용 래퍼 애니메이션
  const animatedCalendarsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // 각 주 애니메이션
  const row0Style = useAnimatedRowStyle(0, selectedWeekIndex, dragProgress);
  const row1Style = useAnimatedRowStyle(1, selectedWeekIndex, dragProgress);
  const row2Style = useAnimatedRowStyle(2, selectedWeekIndex, dragProgress);
  const row3Style = useAnimatedRowStyle(3, selectedWeekIndex, dragProgress);
  const row4Style = useAnimatedRowStyle(4, selectedWeekIndex, dragProgress);
  const row5Style = useAnimatedRowStyle(5, selectedWeekIndex, dragProgress);

  const rowStyles = [
    row0Style,
    row1Style,
    row2Style,
    row3Style,
    row4Style,
    row5Style,
  ];

  // mode가 변경되면 calendarHeight와 dragProgress를 변경
  useEffect(() => {
    if (mode === 'month') {
      calendarHeight.value = withSpring(CALENDAR_HEIGHT_MONTH, {
        damping: DAMPING,
        stiffness: STIFFNESS,
      });
      dragProgress.value = withSpring(0, {
        damping: DAMPING,
        stiffness: STIFFNESS,
      });
    } else {
      calendarHeight.value = withSpring(CALENDAR_HEIGHT_WEEK, {
        damping: DAMPING,
        stiffness: STIFFNESS,
      });
      dragProgress.value = withSpring(1, {
        damping: DAMPING,
        stiffness: STIFFNESS,
      });
    }
  }, [mode, calendarHeight, dragProgress]);

  // viewMonth가 변경되면 translateX를 리셋
  useEffect(() => {
    translateX.value = -width;
  }, [viewMonth, width, translateX]);

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      const { translationX, translationY } = event;
      const heightDiff = CALENDAR_HEIGHT_MONTH - CALENDAR_HEIGHT_WEEK;

      // 제스처 시작 시 약간의 움직임 무시 (탭과의 충돌 방지)
      if (Math.abs(translationX) < 10 && Math.abs(translationY) < 10) {
        return;
      }

      const isVertical = Math.abs(translationY) > Math.abs(translationX);

      if (isVertical) {
        // 수직 스와이프 (월 <-> 주 전환)
        if (mode === 'month') {
          // 월 -> 주 (위로 스와이프)
          const progress = Math.max(0, Math.min(1, -translationY / heightDiff));
          dragProgress.value = progress;
          calendarHeight.value = interpolate(
            progress,
            [0, 1],
            [CALENDAR_HEIGHT_MONTH, CALENDAR_HEIGHT_WEEK],
            Extrapolation.CLAMP,
          );
        } else {
          // 주 -> 월 (아래로 스와이프)
          const progress = Math.max(0, Math.min(1, translationY / heightDiff));
          dragProgress.value = 1 - progress; // 1 -> 0으로 변경
          calendarHeight.value = interpolate(
            1 - progress,
            [0, 1],
            [CALENDAR_HEIGHT_MONTH, CALENDAR_HEIGHT_WEEK],
            Extrapolation.CLAMP,
          );
        }
      } else {
        // --- 수평 스와이프 (월/주 변경) ---
        translateX.value = -width + translationX;
      }
    })
    .onEnd(event => {
      const { velocityY, velocityX, translationY, translationX } = event;
      const isVertical = Math.abs(translationY) > Math.abs(translationX);

      if (isVertical) {
        const shouldSwitch =
          Math.abs(translationY) > SWIPE_THRESHOLD ||
          Math.abs(velocityY) > VELOCITY_THRESHOLD;

        if (mode === 'month' && translationY < 0 && shouldSwitch) {
          // 월 -> 주 전환 성공
          dragProgress.value = withSpring(1, {
            damping: DAMPING,
            stiffness: STIFFNESS,
          });
          calendarHeight.value = withSpring(CALENDAR_HEIGHT_WEEK, {
            damping: DAMPING,
            stiffness: STIFFNESS,
          });
          scheduleOnRN(switchMode, 'week'); // JS 상태 변경
        } else if (mode === 'week' && translationY > 0 && shouldSwitch) {
          // 주 -> 월 전환 성공
          dragProgress.value = withSpring(0, {
            damping: DAMPING,
            stiffness: STIFFNESS,
          });
          calendarHeight.value = withSpring(CALENDAR_HEIGHT_MONTH, {
            damping: DAMPING,
            stiffness: STIFFNESS,
          });
          scheduleOnRN(switchMode, 'month'); // JS 상태 변경
        } else {
          // 전환 실패 (제자리로 복귀)
          const targetProgress = mode === 'month' ? 0 : 1;
          const targetHeight =
            mode === 'month' ? CALENDAR_HEIGHT_MONTH : CALENDAR_HEIGHT_WEEK;
          dragProgress.value = withSpring(targetProgress, {
            damping: DAMPING,
            stiffness: STIFFNESS,
          });
          calendarHeight.value = withSpring(targetHeight, {
            damping: DAMPING,
            stiffness: STIFFNESS,
          });
        }
      } else {
        const shouldChange =
          Math.abs(translationX) > SWIPE_THRESHOLD ||
          Math.abs(velocityX) > VELOCITY_THRESHOLD;

        if (shouldChange) {
          // 변경 성공
          const direction = translationX < 0 ? 1 : -1;
          translateX.value = withTiming(-width * (1 + direction), {
            duration: 200,
          });

          // JS 상태 변경
          if (mode === 'month') {
            scheduleOnRN(changeMonth, direction);
          } else {
            scheduleOnRN(changeWeek, direction);
          }
        } else {
          // 변경 실패
          translateX.value = withSpring(-width, {
            damping: DAMPING,
            stiffness: STIFFNESS,
          });
        }
      }
    });

  return {
    panGesture,
    animatedCalendarContainerStyle,
    animatedCalendarsStyle,
    rowStyles,
  };
};
