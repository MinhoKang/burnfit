import { StatusBar, StyleSheet } from 'react-native';
import BottomTabNavigations from './src/navigations/BottomTabNavigations';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSettingsStore } from './src/stores/useSettingStore';
import { getThemeColors } from './src/constants/colors';
import { useShallow } from 'zustand/react/shallow';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

function App() {
  const themeMode = useSettingsStore(useShallow(state => state.themeMode));
  const themeColors = getThemeColors(themeMode);

  const myTheme = {
    ...(themeMode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(themeMode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: themeColors.TEXT,
      background: themeColors.BACKGROUND,
      card: themeColors.BACKGROUND,
      text: themeColors.TEXT,
      border: themeColors.BORDER,
    },
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: themeColors.BACKGROUND },
          ]}
        >
          <StatusBar
            barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          />
          <BottomTabNavigations theme={myTheme} />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
});
