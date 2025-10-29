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
import { COLORS } from '../../constants/colors';
import { CALENDAR_STYLES } from './calendar.style';
import { CalendarItem } from './CalendarItem';
import { useSettingsStore } from '../../stores/useSettingStore';
import { useMemo } from 'react';

const WEEK_DAYS_SUN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_DAYS_MON = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
  } = logic;
  const { startOfWeek } = useSettingsStore();

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
    <View style={CALENDAR_STYLES.container}>
      {/* 헤더 */}
      <View style={CALENDAR_STYLES.header}>
        <TouchableOpacity
          onPress={() => (mode === 'month' ? changeMonth(-1) : changeWeek(-1))}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.LIGHT_BLUE} />
        </TouchableOpacity>
        <Text style={CALENDAR_STYLES.monthYear}>{headerText}</Text>
        <TouchableOpacity
          onPress={() => (mode === 'month' ? changeMonth(1) : changeWeek(1))}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={COLORS.LIGHT_BLUE}
          />
        </TouchableOpacity>
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
                // ✅ 일요일(startOfWeek: 0) 시작일 때:
                startOfWeek === 'sunday' &&
                  index === 0 &&
                  CALENDAR_STYLES.sundayText, // 0번째(Sun)가 빨간색
                startOfWeek === 'sunday' &&
                  index === 6 &&
                  CALENDAR_STYLES.saturdayText, // 6번째(Sat)가 파란색

                // ✅ 월요일(startOfWeek: 1) 시작일 때:
                startOfWeek === 'monday' &&
                  index === 6 &&
                  CALENDAR_STYLES.sundayText, // 6번째(Sun)가 빨간색
                startOfWeek === 'monday' &&
                  index === 5 &&
                  CALENDAR_STYLES.saturdayText, // 5번째(Sat)가 파란색
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
