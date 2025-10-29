import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSettingsStore } from '../../stores/useSettingStore';
import { COLORS } from '../../constants/colors';

const MyPageScreen = () => {
  const { startOfWeek, setStartOfWeek } = useSettingsStore();

  const toggleStartOfWeek = () => {
    const newStartDay = startOfWeek === 'sunday' ? 'monday' : 'sunday';
    setStartOfWeek(newStartDay);
  };

  return (
    <View style={styles.container}>
      <Text>MyPageScreen</Text>
      <Pressable style={styles.button} onPress={toggleStartOfWeek}>
        <Text style={styles.buttonText}>
          Toggle Start of Week: {startOfWeek}
        </Text>
      </Pressable>
    </View>
  );
};

export default MyPageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    padding: 10,
    backgroundColor: COLORS.LIGHT_BLUE,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
