import Icon from '@/components/Icon';
import Text from '@/components/Text';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotification } from '@/hooks/useNotification';
import CalendarScreen from '@/screens/CalendarScreen';
import GroupScreen from '@/screens/GroupScreen';
import NotificationScreen from '@/screens/NotificationScreen';
import SettingScreen from '@/screens/SettingScreen';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { isIOS } from '@/utils/factory';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

const TabNavigator = () => {
  const Tab = useMemo(() => createBottomTabNavigator(), []);
  const { resetCalendarState } = useCalendar();
  const [lastPress, setLastPress] = useState(0);
  const { colors } = useUIKitTheme();
  const { notification } = useNotification();

  const handleIconPress = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (now - lastPress < DOUBLE_PRESS_DELAY) {
      resetCalendarState();
    }

    setLastPress(now);
  };

  const TabScreens = [
    { name: 'CalendarScreen', component: CalendarScreen },
    {
      name: 'GroupScreen',
      component: GroupScreen,
    },
    {
      name: 'NotificationScreen',
      component: NotificationScreen,
    },
    {
      name: 'SettingScreen',
      component: SettingScreen,
    },
  ];

  return (
    <Tab.Navigator
      backBehavior="history"
      screenOptions={({ route }) => ({
        tabBarLabel: ({ color }) => {
          let label;
          if (route.name === 'CalendarScreen') label = '캘린더';
          else if (route.name === 'GroupScreen') label = '그룹';
          else if (route.name === 'NotificationScreen') label = '알림';
          else if (route.name === 'SettingScreen') label = '더보기';

          return <Text color={color}>{label}</Text>;
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'CalendarScreen') {
            return (
              <Icon color={color} size={size} name="calendar-number-outline" icon="Ionicons" />
            );
          }
          if (route.name === 'GroupScreen') {
            return (
              <Icon color={color} size={size} name="account-group" icon="MaterialCommunityIcons" />
            );
          }
          if (route.name === 'NotificationScreen') {
            return (
              <View>
                <Icon color={color} size={size} name="notifications-outline" icon="Ionicons" />
                {notification.notRead && (
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      position: 'absolute',
                      backgroundColor: '#fd6b70',
                      right: 0,
                      borderRadius: 100,
                    }}
                  />
                )}
              </View>
            );
          }
          if (route.name === 'SettingScreen') {
            return (
              <Icon
                color={color}
                size={size}
                name="hexagon-slice-6"
                icon="MaterialCommunityIcons"
              />
            );
          }
        },
        tabBarActiveTintColor: '#FFA500',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          elevation: 0,
          ...(isIOS ? { height: 90 } : {}),
        },
        tabBarButton: ({ children, onPress, to }) => (
          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            onPress={(e) => {
              onPress?.(e);
              if (to === '/Tabs/CalendarScreen') handleIconPress();
            }}
          >
            {children}
          </TouchableOpacity>
        ),
      })}
    >
      {TabScreens.map(({ name, component }) => (
        <Tab.Screen key={name} name={name} component={component} />
      ))}
    </Tab.Navigator>
  );
};

export default TabNavigator;
