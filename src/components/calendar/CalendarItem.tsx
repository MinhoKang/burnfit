import React from 'react';
import Animated from 'react-native-reanimated';
import { CALENDAR_STYLES } from './calendar.style';
import {
  checkIsSelectedDay,
  getDisplayDay,
  isOtherMonthDay,
} from '../../helpers/calendar';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export const CalendarItem = React.memo(
  ({
    rowIndex,
    row,
    monthDate,
    selectedDate,
    selectDate,
    dayWidth,
    rowStyles,
    themeColors,
  }: {
    rowIndex: number;
    row: number[];
    monthDate: Date;
    selectedDate: Date;
    selectDate: (day: number) => void;
    dayWidth: number;
    rowStyles: StyleProp<ViewStyle>[];
    themeColors: { TEXT: string; TEXT_SECONDARY: string; BORDER: string };
  }) => {
    return (
      <Animated.View
        key={rowIndex}
        style={[CALENDAR_STYLES.row, rowStyles[rowIndex]]}
      >
        {row.map((day, colIndex) => {
          const isOtherMonth = isOtherMonthDay(day);
          const isSelectedDay = checkIsSelectedDay(
            day,
            monthDate,
            selectedDate,
          );
          const displayDay = getDisplayDay(day);

          return (
            <TouchableOpacity
              key={colIndex}
              style={[
                CALENDAR_STYLES.dayContainer,
                { width: dayWidth, height: dayWidth },
              ]}
              onPress={() => selectDate(Number(day))}
            >
              <View
                style={[isSelectedDay && CALENDAR_STYLES.selectedDayContainer]}
              >
                <Text
                  style={[
                    CALENDAR_STYLES.dayText,
                    !isOtherMonth && { color: themeColors.TEXT },
                    isSelectedDay && { color: themeColors.TEXT },
                  ]}
                >
                  {displayDay}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    );
  },
);
