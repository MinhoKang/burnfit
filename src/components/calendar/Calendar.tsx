import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useCalendarLogic } from '../../hooks/calendar/useCalendarLogic';
import { useCalendarAnimation } from '../../hooks/calendar/useCalendarAnimation';
import { COLORS, getThemeColors } from '../../constants/colors';
import { CALENDAR_STYLES } from './calendar.style';
import { CalendarItem } from './CalendarItem';
import { useSettingsStore } from '../../stores/useSettingStore';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { WEEK_DAYS_MON, WEEK_DAYS_SUN } from '../../constants/date';

const Calendar = () => {
  const logic = useCalendarLogic();
  const {
    mode,
    viewMonth,
    selectedDate,
    changeMonth,
    changeWeek,
    selectDate,
    matrices,
    dateHelpers,
    headerText,
    goToToday,
  } = logic;
  const { startOfWeek, themeMode } = useSettingsStore(
    useShallow(state => ({
      startOfWeek: state.startOfWeek,
      themeMode: state.themeMode,
    })),
  );
  const themeColors = useMemo(() => getThemeColors(themeMode), [themeMode]);
  const iconColor = useMemo(
    () => (themeMode === 'light' ? COLORS.LIGHT_BLUE : COLORS.LIGHT_BLUE),
    [themeMode],
  );

  const { width } = useWindowDimensions();
  const dayWidth = (width - 40) / 7;

  const animation = useCalendarAnimation(logic, width);

  const dynamicWeekDays = useMemo(() => {
    return startOfWeek === 'monday' ? WEEK_DAYS_MON : WEEK_DAYS_SUN;
  }, [startOfWeek]);

  const {
    panGesture,
    animatedCalendarContainerStyle,
    animatedCalendarsStyle,
    rowStyles,
  } = animation;

  return (
    <View
      style={[
        CALENDAR_STYLES.container,
        { backgroundColor: themeColors.BACKGROUND },
      ]}
    >
      {/* 헤더 */}
      <View style={CALENDAR_STYLES.header}>
        <TouchableOpacity
          onPress={() => (mode === 'month' ? changeMonth(-1) : changeWeek(-1))}
        >
          <Ionicons name="chevron-back" size={24} color={iconColor} />
        </TouchableOpacity>
        <Text style={[CALENDAR_STYLES.monthYear, { color: themeColors.TEXT }]}>
          {headerText}
        </Text>
        <View style={CALENDAR_STYLES.headerRightGroup}>
          {/* 3. "오늘" 버튼 추가 */}
          <TouchableOpacity
            onPress={goToToday}
            style={CALENDAR_STYLES.todayButton}
          >
            <Ionicons name="today-outline" size={22} color={iconColor} />
          </TouchableOpacity>

          {/* 다음 버튼 */}
          <TouchableOpacity
            onPress={() => (mode === 'month' ? changeMonth(1) : changeWeek(1))}
          >
            <Ionicons name="chevron-forward" size={24} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 요일 헤더 */}
      <View style={CALENDAR_STYLES.weekHeader}>
        {dynamicWeekDays.map((day, index) => (
          <View
            key={day}
            style={[CALENDAR_STYLES.dayContainer, { width: dayWidth }]}
          >
            <Text
              style={[
                CALENDAR_STYLES.headerText,
                startOfWeek === 'sunday' &&
                  index === 0 &&
                  CALENDAR_STYLES.sundayText,
                startOfWeek === 'sunday' &&
                  index === 6 &&
                  CALENDAR_STYLES.saturdayText,

                startOfWeek === 'monday' &&
                  index === 6 &&
                  CALENDAR_STYLES.sundayText,
                startOfWeek === 'monday' &&
                  index === 5 &&
                  CALENDAR_STYLES.saturdayText,
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 캘린더 (제스처 + 애니메이션) */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedCalendarContainerStyle}>
          <Animated.View
            style={[CALENDAR_STYLES.calendarsRow, animatedCalendarsStyle]}
          >
            {/* 이전 달/주 */}
            <View style={[{ width }]}>
              {matrices.prev.map((row, rowIndex) => (
                <CalendarItem
                  key={rowIndex}
                  rowIndex={rowIndex}
                  row={row}
                  monthDate={
                    mode === 'week'
                      ? dateHelpers.prevWeekDate
                      : dateHelpers.prevMonthDate
                  }
                  selectedDate={selectedDate}
                  selectDate={selectDate}
                  dayWidth={dayWidth}
                  rowStyles={rowStyles}
                  themeMode={themeMode}
                />
              ))}
            </View>

            {/* 현재 달/주 */}
            <View style={[{ width }]}>
              {matrices.current.map((row, rowIndex) => (
                <CalendarItem
                  key={rowIndex}
                  rowIndex={rowIndex}
                  row={row}
                  monthDate={viewMonth}
                  selectedDate={selectedDate}
                  selectDate={selectDate}
                  dayWidth={dayWidth}
                  rowStyles={rowStyles}
                  themeMode={themeMode}
                />
              ))}
            </View>

            {/* 다음 달/주 */}
            <View style={[{ width }]}>
              {matrices.next.map((row, rowIndex) => (
                <CalendarItem
                  key={rowIndex}
                  rowIndex={rowIndex}
                  row={row}
                  monthDate={
                    mode === 'week'
                      ? dateHelpers.nextWeekDate
                      : dateHelpers.nextMonthDate
                  }
                  selectedDate={selectedDate}
                  selectDate={selectDate}
                  dayWidth={dayWidth}
                  rowStyles={rowStyles}
                  themeMode={themeMode}
                />
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default Calendar;
