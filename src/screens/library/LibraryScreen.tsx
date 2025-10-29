import { View, Text, StyleSheet } from 'react-native';
import { useSettingsStore } from '../../stores/useSettingStore';
import { getThemeColors } from '../../constants/colors';
import { useShallow } from 'zustand/react/shallow';

const LibraryScreen = () => {
  const themeMode = useSettingsStore(useShallow(state => state.themeMode));
  const themeColors = getThemeColors(themeMode);

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.BACKGROUND }]}
    >
      <Text style={{ color: themeColors.TEXT }}>LibraryScreen</Text>
    </View>
  );
};

export default LibraryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
