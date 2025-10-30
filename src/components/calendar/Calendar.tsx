import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useCalendarLogic } from '../../hooks/calendar/useCalendarLogic';
import { useCalendarAnimation } from '../../hooks/calendar/useCalendarAnimation';
import { WEEK_DAYS } from '../../constants/date';
import { COLORS } from '../../constants/colors';
import { CALENDAR_STYLES } from './calendar.style';
import { CalendarItem } from './CalendarItem';

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

  const { width } = Dimensions.get('window');
  // 폴더블 대응: 너비 800px 이상일 때 50px로 설정
  const dayWidth = width > 800 ? 50 : (width - 40) / 7;

  const animation = useCalendarAnimation(logic);
  const {
    panGesture,
    animatedCalendarContainerStyle,
    animatedCalendarsStyle,
    prevRowStyles,
    currentRowStyles,
    nextRowStyles,
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
        {WEEK_DAYS.map((day, index) => (
          <View
            key={day}
            style={[CALENDAR_STYLES.dayContainer, { width: dayWidth }]}
          >
            <Text
              style={[
                CALENDAR_STYLES.headerText,
                index === 0 && CALENDAR_STYLES.sundayText,
                index === 6 && CALENDAR_STYLES.saturdayText,
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
                  rowStyles={prevRowStyles}
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
                  rowStyles={currentRowStyles}
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
                  rowStyles={nextRowStyles}
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
