import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WEEK_DAYS } from '../constants/date';
import { formatMonthYear, generateCalendarMatrix } from '../utils/date';
import { COLORS } from '../constants/colors';

const Calendar = () => {
  const [activeDate, setActiveDate] = useState(new Date());

  const matrix = generateCalendarMatrix(
    activeDate.getFullYear(),
    activeDate.getMonth(),
    WEEK_DAYS,
  );
  const { width } = Dimensions.get('window');
  const dayWidth = (width - 40) / 7;

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.monthYear}>{formatMonthYear(activeDate)}</Text>
      </View>

      {/* 캘린더 그리드 */}
      <View style={styles.calendar}>
        {matrix.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item, colIndex) => {
              const day = Number(item);
              const isHeader = rowIndex === 0;
              const isSunday = colIndex === 0;
              const isSaturday = colIndex === 6;

              const isOtherMonth = day < 0 || day > 100;

              const displayDay = day < 0 ? -day : day > 100 ? day - 100 : day;

              return (
                <View
                  key={colIndex}
                  style={[
                    styles.dayContainer,
                    { width: dayWidth, height: isHeader ? 'auto' : dayWidth },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isHeader && styles.headerText,
                      isSunday && isHeader && styles.sundayText,
                      isSaturday && isHeader && styles.saturdayText,
                      isOtherMonth && styles.otherMonthText,
                    ]}
                  >
                    {displayDay}
                  </Text>
                </View>
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
});
export default Calendar;
