import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import { createStaticNavigation } from '@react-navigation/native';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import LibraryScreen from '../screens/library/LibraryScreen';
import MyPageScreen from '../screens/myPage/MyPageScreen';

const BottomTabs = createBottomTabNavigator({
  screens: {
    HomeScreen: HomeScreen,
    CalendarScreen: CalendarScreen,
    LibraryScreen: LibraryScreen,
    MyPageScreen: MyPageScreen,
  },
  screenOptions: {
    headerShown: false,
  },
});

const BottomTabNavigations = createStaticNavigation(BottomTabs);

export default BottomTabNavigations;
