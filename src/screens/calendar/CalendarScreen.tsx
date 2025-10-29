import { View, StyleSheet } from 'react-native';
import Calendar from '../../components/calendar/Calendar';
import { useSettingsStore } from '../../stores/useSettingStore';
import { getThemeColors } from '../../constants/colors';
import { useShallow } from 'zustand/react/shallow';

const CalendarScreen = () => {
  const themeMode = useSettingsStore(useShallow(state => state.themeMode));
  const themeColors = getThemeColors(themeMode);

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.BACKGROUND }]}
    >
      <Calendar />
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});
