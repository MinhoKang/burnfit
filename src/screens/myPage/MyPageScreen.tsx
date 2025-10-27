import { View, Text, StyleSheet } from 'react-native';

const MyPageScreen = () => {
  return (
    <View style={styles.container}>
      <Text>MyPageScreen</Text>
    </View>
  );
};

export default MyPageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
