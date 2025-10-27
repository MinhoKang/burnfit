import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { WEEK_DAYS } from '../constants/date';
import { formatMonthYear, generateCalendarMatrix } from '../utils/date';
import { COLORS } from '../constants/colors';

const Calendar = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const matrix = generateCalendarMatrix(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    WEEK_DAYS,
  );

  // 날짜 선택 함수
  const selectDate = (day: number) => {
    if (day > 0 && day < 100) {
      const newDate = new Date(selectedDate);
      newDate.setDate(day);
      setSelectedDate(newDate);
    }
  };
  const { width } = Dimensions.get('window');
  const dayWidth = (width - 40) / 7;

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.monthYear}>{formatMonthYear(selectedDate)}</Text>
      </View>

      {/* 캘린더 그리드 */}
      <View style={styles.calendar}>
        {matrix.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item, colIndex) => {
              const day = typeof item === 'number' ? item : Number(item);
              const isHeader = rowIndex === 0;
              const isSunday = colIndex === 0;
              const isSaturday = colIndex === 6;

              const isOtherMonth = day < 0 || day > 100;

              const isSelectedDay = day === selectedDate.getDate();

              const displayDay = day < 0 ? -day : day > 100 ? day - 100 : day;

              return (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.dayContainer,
                    { width: dayWidth, height: isHeader ? 'auto' : dayWidth },
                  ]}
                  onPress={() => selectDate(day)}
                >
                  <View style={isSelectedDay && styles.selectedDayContainer}>
                    <Text
                      style={[
                        styles.dayText,
                        isHeader && styles.headerText,
                        isSunday && isHeader && styles.sundayText,
                        isSaturday && isHeader && styles.saturdayText,
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.DARK_GRAY,
  },
  calendar: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
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
});

export default Calendar;
