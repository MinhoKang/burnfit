import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import BottomTabNavigations from './src/navigations/BottomTabNavigations';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <BottomTabNavigations />
      </GestureHandlerRootView>
    </SafeAreaView>
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
