import { asyncStorageKeys } from '@/constants/asyncStorage';
import { useGroup } from '@/hooks/useGroup';
import { useNotification } from '@/hooks/useNotification';
import { useSchedule } from '@/hooks/useSchedule';
import { useUserInfo } from '@/hooks/useUserInfo';
import PlayGroundScreen from '@/screens/PlayGroundScreen';
import OnboardingScreen from '@/screens/auth/OnboardingScreen';
import SignInScreen from '@/screens/auth/SignInScreen';
import SignUpEmailScreen from '@/screens/auth/SignUpEmailScreen';
import SignUpTermsScreen from '@/screens/auth/SignUpTermsScreen';
import TermsScreen from '@/screens/auth/TermsScreen';
import AssignLeaderScreen from '@/screens/group/AssignLeaderScreen';
import ChangeGroupInfoScreen from '@/screens/group/ChangeGroupInfoScreen';
import GroupCreateScreen from '@/screens/group/GroupCreateScreen';
import GroupDetailScreen from '@/screens/group/GroupDetailScreen';
import GroupFrontDoorScreen from '@/screens/group/GroupFrontDoorScreen';
import GroupInviteScreen from '@/screens/group/GroupInviteScreen';
import GroupSearchScreen from '@/screens/group/GroupSearchScreen';
import GroupSettingScreen from '@/screens/group/GroupSettingScreen';
import GroupSubLeaderScreen from '@/screens/group/GroupSubLeaderScreen';
import ScheduleCreateScreen from '@/screens/schedule/ScheduleCreateScreen';
import ScheduleDetailScreen from '@/screens/schedule/ScheduleDetailScreen';
import ScheduleReplyScreen from '@/screens/schedule/ScheduleReplyScreen';
import AppVersionScreen from '@/screens/setting/AppVersionScreen';
import ChangeBirthScreen from '@/screens/setting/ChangeBirthScreen';
import ChangeNicknameScreen from '@/screens/setting/ChangeNicknameScreen';
import LanguageScreen from '@/screens/setting/LanguageScreen';
import MyInfoScreen from '@/screens/setting/MyInfoScreen';
import NoticesScreen from '@/screens/setting/NoticesScreen';
import NotificationSettingScreen from '@/screens/setting/NotificationSettingScreen';
import TermsListScreen from '@/screens/setting/TermsListScreen';
import { getUserInfo } from '@/services/auth';
import { getMyGroups } from '@/services/group';
import { getNotifications } from '@/services/notification';
import { getAllSchedule } from '@/services/schedule';
import { ParamListBase, Routes } from '@/types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator<ParamListBase>();

const RootNavigator = () => {
  const { userInfo, setUserInfoState } = useUserInfo();
  const { setScheduleState } = useSchedule();
  const { setNotificationState } = useNotification();
  const { setGroupState } = useGroup();

  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await AsyncStorage.getItem(asyncStorageKeys.accessToken);
        if (!token) return;

        await setUserInfoState(await getUserInfo());
        await setScheduleState(
          await getAllSchedule({
            start: '2024-01-01',
            end: '2025-12-31',
          }),
        );
        await setGroupState(await getMyGroups());
        await setNotificationState(await getNotifications());
      } catch (err) {
        console.log('initialize err :', err);
        await AsyncStorage.removeItem(asyncStorageKeys.accessToken);
        await AsyncStorage.removeItem(asyncStorageKeys.refreshToken);
      } finally {
        setFetching(false);
      }
    };
    initialize();
  }, []);

  if (fetching) return <View />;

  return (
    <Stack.Navigator
      // initialRouteName={Routes.PlayGroundScreen}
      screenOptions={{
        headerShown: false,
        statusBarTranslucent: true,
      }}
    >
      {!userInfo.userId ? (
        <>
          <Stack.Screen name={Routes.SignInScreen} component={SignInScreen} />
          <Stack.Screen name={Routes.SignUpTermsScreen} component={SignUpTermsScreen} />
          <Stack.Screen name={Routes.SignUpEmailScreen} component={SignUpEmailScreen} />
          <Stack.Screen name={Routes.OnboardingScreen} component={OnboardingScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name={Routes.Tabs} component={TabNavigator} />

          {/* 공유 */}

          {/* 일정 */}
          <Stack.Screen
            name={Routes.ScheduleCreateScreen}
            component={ScheduleCreateScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen name={Routes.ScheduleDetailScreen} component={ScheduleDetailScreen} />
          <Stack.Screen name={Routes.ScheduleReplyScreen} component={ScheduleReplyScreen} />

          {/* 그룹 */}
          <Stack.Screen
            name={Routes.GroupCreateScreen}
            component={GroupCreateScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen name={Routes.GroupDetailScreen} component={GroupDetailScreen} />
          <Stack.Screen name={Routes.GroupSearchScreen} component={GroupSearchScreen} />
          <Stack.Screen name={Routes.GroupInviteScreen} component={GroupInviteScreen} />
          <Stack.Screen name={Routes.GroupFrontDoorScreen} component={GroupFrontDoorScreen} />
          <Stack.Screen name={Routes.GroupSettingScreen} component={GroupSettingScreen} />
          <Stack.Screen name={Routes.ChangeGroupInfoScreen} component={ChangeGroupInfoScreen} />
          <Stack.Screen name={Routes.GroupSubLeaderScreen} component={GroupSubLeaderScreen} />
          <Stack.Screen name={Routes.AssignLeaderScreen} component={AssignLeaderScreen} />

          {/* 내 정보 */}
          <Stack.Screen name={Routes.AppVersionScreen} component={AppVersionScreen} />
          <Stack.Screen name={Routes.LanguageScreen} component={LanguageScreen} />
          <Stack.Screen name={Routes.MyInfoScreen} component={MyInfoScreen} />
          <Stack.Screen
            name={Routes.NotificationSettingScreen}
            component={NotificationSettingScreen}
          />
          <Stack.Screen name={Routes.NoticesScreen} component={NoticesScreen} />
          <Stack.Screen name={Routes.TermsListScreen} component={TermsListScreen} />
          <Stack.Screen name={Routes.ChangeNicknameScreen} component={ChangeNicknameScreen} />
          <Stack.Screen name={Routes.ChangeBirthScreen} component={ChangeBirthScreen} />
        </>
      )}

      <Stack.Screen name={Routes.TermsScreen} component={TermsScreen} />
      <Stack.Screen name={Routes.PlayGroundScreen} component={PlayGroundScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
