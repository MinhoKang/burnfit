import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const CALENDAR_STYLES = StyleSheet.create({
  root: {
    flex: 1,
  },
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
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  todayButton: {
    padding: 2,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.DARK_GRAY,
  },
  calendarsRow: {
    flexDirection: 'row',
  },
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
    color: COLORS.LIGHT.TEXT,
    fontWeight: '700',
  },
  selectedDayContainer: {
    borderColor: COLORS.DARK_BLUE,
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
