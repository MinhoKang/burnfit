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
import { COLORS } from '../../constants/colors';
import { ThemeMode } from '../../types/theme';

export const CalendarItem = React.memo(
  ({
    rowIndex,
    row,
    monthDate,
    selectedDate,
    selectDate,
    dayWidth,
    rowStyles,
    themeMode,
  }: {
    rowIndex: number;
    row: number[];
    monthDate: Date;
    selectedDate: Date;
    selectDate: (day: number) => void;
    dayWidth: number;
    rowStyles: StyleProp<ViewStyle>[];
    themeMode: ThemeMode;
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
                    CALENDAR_STYLES.dayText, // 1. 기본 스타일 적용
                    // 2. 테마 모드에 따라 스타일 객체 분기
                    themeMode === 'dark'
                      ? // --- 다크 모드 스타일 ---
                        {
                          // 3. 다른 달 vs 현재 달 색상 결정
                          color: isOtherMonth ? COLORS.GRAY : COLORS.DARK.TEXT,
                          // 4. 선택된 날 스타일 적용 (fontWeight 추가, 색상 유지)
                          ...(isSelectedDay && {
                            // color: COLORS.DARK.TEXT, // 이미 현재 달 색상이므로 생략 가능
                            fontWeight: '700',
                          }),
                        }
                      : // --- 라이트 모드 스타일 ---
                        {
                          // 3. 다른 달 vs 현재 달 색상 결정
                          color: isOtherMonth
                            ? COLORS.LIGHT_GRAY
                            : COLORS.DARK_GRAY,
                          // 4. 선택된 날 스타일 적용 (색상 덮어쓰기 + fontWeight 추가)
                          ...(isSelectedDay && CALENDAR_STYLES.selectedDayText),
                        },
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
