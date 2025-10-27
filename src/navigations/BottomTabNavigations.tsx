import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import { createStaticNavigation } from '@react-navigation/native';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import LibraryScreen from '../screens/library/LibraryScreen';
import MyPageScreen from '../screens/myPage/MyPageScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomTabs = createBottomTabNavigator({
  screens: {
    HomeScreen: {
      screen: HomeScreen,
      options: {
        title: 'HOME',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      },
    },
    CalendarScreen: {
      screen: CalendarScreen,
      options: {
        title: 'CALENDAR',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="calendar-outline" color={color} size={size} />
        ),
      },
    },
    LibraryScreen: {
      screen: LibraryScreen,
      options: {
        title: 'LIBRARY',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
        ),
      },
    },
    MyPageScreen: {
      screen: MyPageScreen,
      options: {
        title: 'MY PAGE',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" color={color} size={size} />
        ),
      },
    },
  },
  screenOptions: {
    headerShown: false,
    tabBarActiveTintColor: '#000000',
    tabBarLabelStyle: {
      fontWeight: 'bold',
      fontSize: 12,
      marginTop: 3,
    },
  },
});

const BottomTabNavigations = createStaticNavigation(BottomTabs);

export default BottomTabNavigations;
