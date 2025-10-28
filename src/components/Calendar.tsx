import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { WEEK_DAYS } from '../constants/date';
import { formatMonthYear } from '../utils/date';
import { COLORS } from '../constants/colors';
import {
  checkIsSelectedDay,
  getDisplayDay,
  isOtherMonthDay,
  generateCalendarMatrix,
  generateWeekCalendarMatrix,
} from '../helpers/calendar';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TODAY = new Date();
type CalendarMode = 'month' | 'week';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [viewMonth, setViewMonth] = useState(TODAY);
  const [mode, setMode] = useState<CalendarMode>('month');

  const monthMatrix = generateCalendarMatrix(
    viewMonth.getFullYear(),
    viewMonth.getMonth(),
  );

  const weekMatrix = [generateWeekCalendarMatrix(selectedDate)];

  const matrix = mode === 'month' ? monthMatrix : weekMatrix;

  const { width } = Dimensions.get('window');
  const dayWidth = (width - 40) / 7;

  // 월 변경 함수
  const changeMonth = (direction: number) => {
    const newDate = new Date(viewMonth);
    newDate.setMonth(viewMonth.getMonth() + direction);
    setViewMonth(newDate);
  };

  // 날짜 선택 함수
  const selectDate = (day: number) => {
    const newDate = new Date(viewMonth);

    if (day < 0) {
      // 이전 달 날짜 클릭
      newDate.setMonth(viewMonth.getMonth() - 1);
      newDate.setDate(-day);
      setSelectedDate(newDate);
      setViewMonth(newDate);
    } else if (day > 100) {
      // 다음 달 날짜 클릭
      newDate.setMonth(viewMonth.getMonth() + 1);
      newDate.setDate(day - 100);
      setSelectedDate(newDate);
      setViewMonth(newDate);
    } else {
      // 현재 달 날짜 클릭
      newDate.setDate(day);
      setSelectedDate(newDate);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Ionicons name="chevron-back" size={24} color={COLORS.LIGHT_BLUE} />
        </TouchableOpacity>

        <Text style={styles.monthYear}>{formatMonthYear(viewMonth)}</Text>

        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={COLORS.LIGHT_BLUE}
          />
        </TouchableOpacity>
      </View>

      <View>
        {/* 요일 헤더 */}
        <View style={styles.weekHeader}>
          {WEEK_DAYS.map((day, index) => (
            <View key={day} style={[styles.dayContainer, { width: dayWidth }]}>
              <Text
                style={[
                  styles.headerText,
                  index === 0 && styles.sundayText,
                  index === 6 && styles.saturdayText,
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* 캘린더 그리드 */}
        <View style={styles.calendar}>
          <View>
            {matrix.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((day, colIndex) => {
                  const isOtherMonth = isOtherMonthDay(day);
                  const isSelectedDay = checkIsSelectedDay(
                    day,
                    viewMonth,
                    selectedDate,
                  );
                  const displayDay = getDisplayDay(day);

                  return (
                    <TouchableOpacity
                      key={colIndex}
                      style={[
                        styles.dayContainer,
                        { width: dayWidth, height: dayWidth },
                      ]}
                      onPress={() => selectDate(Number(day))}
                    >
                      <View
                        style={isSelectedDay && styles.selectedDayContainer}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            isOtherMonth && styles.otherMonthText,
                            isSelectedDay && styles.selectedDayText,
                          ]}
                        >
                          {displayDay}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setMode(mode === 'month' ? 'week' : 'month')}
        >
          <Text>Toggle: {mode}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    gap: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.DARK_GRAY,
  },
  calendar: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    color: COLORS.DARK_GRAY,
    fontWeight: '400',
    zIndex: 1,
  },
  headerText: {
    color: COLORS.GRAY,
    fontWeight: '500',
    fontSize: 14,
  },
  sundayText: {
    color: COLORS.RED,
  },
  saturdayText: {
    color: COLORS.LIGHT_BLUE,
  },
  otherMonthText: {
    color: COLORS.LIGHT_GRAY,
  },
  selectedDayText: {
    color: COLORS.NAVY,
    fontWeight: '700',
  },
  selectedDayContainer: {
    borderColor: COLORS.LIGHT_BLUE,
    borderWidth: 1,
    borderRadius: 50,
    padding: 8,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default Calendar;
