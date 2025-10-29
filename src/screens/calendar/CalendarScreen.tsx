import { View, StyleSheet } from 'react-native';
import Calendar from '../../components/calendar/Calendar';

const CalendarScreen = () => {
  return (
    <View style={styles.container}>
      <Calendar />
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
  },
});
