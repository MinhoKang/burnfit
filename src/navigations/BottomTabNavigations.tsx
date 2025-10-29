import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import LibraryScreen from '../screens/library/LibraryScreen';
import MyPageScreen from '../screens/myPage/MyPageScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSettingsStore } from '../stores/useSettingStore';
import { COLORS, getThemeColors } from '../constants/colors';
import { useShallow } from 'zustand/react/shallow';
import { NavigationContainer } from '@react-navigation/native';
import { useMemo } from 'react';

const Tab = createBottomTabNavigator();

const renderHomeIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialCommunityIcons name="home" color={color} size={size} />
);

const renderCalendarIcon = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => <Ionicons name="calendar-outline" color={color} size={size} />;

const renderLibraryIcon = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => <MaterialCommunityIcons name="dumbbell" color={color} size={size} />;

const renderMyPageIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="person-outline" color={color} size={size} />
);

interface BottomTabNavigationsProps {
  theme?: any;
}

const BottomTabNavigations = ({ theme }: BottomTabNavigationsProps) => {
  const themeMode = useSettingsStore(useShallow(state => state.themeMode));
  const themeColors = getThemeColors(themeMode);

  const tabBarActiveTintColor = useMemo(() => {
    return themeMode === 'light' ? themeColors.TEXT : COLORS.LIGHT_BLUE;
  }, [themeMode, themeColors]);

  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor,
          tabBarInactiveTintColor:
            themeMode === 'dark'
              ? themeColors.TEXT
              : themeColors.TEXT_SECONDARY,
          tabBarStyle: {
            backgroundColor: themeColors.BACKGROUND,
            borderTopColor: themeColors.BORDER,
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 12,
            marginTop: 3,
          },
        }}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: 'HOME',
            tabBarIcon: renderHomeIcon,
          }}
        />
        <Tab.Screen
          name="CalendarScreen"
          component={CalendarScreen}
          options={{
            title: 'CALENDAR',
            tabBarIcon: renderCalendarIcon,
          }}
        />
        <Tab.Screen
          name="LibraryScreen"
          component={LibraryScreen}
          options={{
            title: 'LIBRARY',
            tabBarIcon: renderLibraryIcon,
          }}
        />
        <Tab.Screen
          name="MyPageScreen"
          component={MyPageScreen}
          options={{
            title: 'MY PAGE',
            tabBarIcon: renderMyPageIcon,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigations;
