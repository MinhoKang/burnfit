import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSettingsStore } from '../../stores/useSettingStore';
import { COLORS, getThemeColors } from '../../constants/colors';
import { useShallow } from 'zustand/react/shallow';

const MyPageScreen = () => {
  const { startOfWeek, setStartOfWeek, themeMode, setThemeMode } =
    useSettingsStore(
      useShallow(state => ({
        startOfWeek: state.startOfWeek,
        setStartOfWeek: state.setStartOfWeek,
        themeMode: state.themeMode,
        setThemeMode: state.setThemeMode,
      })),
    );
  const themeColors = getThemeColors(themeMode);

  const toggleStartOfWeek = () => {
    const newStartDay = startOfWeek === 'sunday' ? 'monday' : 'sunday';
    setStartOfWeek(newStartDay);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.BACKGROUND }]}
    >
      <Text style={[styles.title, { color: themeColors.TEXT }]}>Settings</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.TEXT }]}>
          Theme Mode
        </Text>
        <View style={styles.themeButtonContainer}>
          <Pressable
            style={[
              styles.themeButton,
              themeMode === 'light' && styles.themeButtonActive,
              themeMode === 'light' && { backgroundColor: COLORS.LIGHT_BLUE },
              themeMode !== 'light' && { borderColor: themeColors.BORDER },
            ]}
            onPress={() => setThemeMode('light')}
          >
            <Text
              style={[
                styles.themeButtonText,
                themeMode === 'light'
                  ? styles.themeButtonTextActive
                  : { color: themeColors.TEXT },
              ]}
            >
              Light Mode
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.themeButton,
              themeMode === 'dark' && styles.themeButtonActive,
              themeMode === 'dark' && { backgroundColor: COLORS.LIGHT_BLUE },
              themeMode !== 'dark' && { borderColor: themeColors.BORDER },
            ]}
            onPress={() => setThemeMode('dark')}
          >
            <Text
              style={[
                styles.themeButtonText,
                themeMode === 'dark'
                  ? styles.themeButtonTextActive
                  : { color: themeColors.TEXT },
              ]}
            >
              Dark Mode
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.TEXT }]}>
          Start of Week
        </Text>
        <Pressable style={styles.button} onPress={toggleStartOfWeek}>
          <Text style={styles.buttonText}>Toggle: {startOfWeek}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default MyPageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  themeButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  themeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonActive: {
    borderWidth: 0,
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeButtonTextActive: {
    color: 'white',
  },
  button: {
    padding: 12,
    backgroundColor: COLORS.LIGHT_BLUE,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
