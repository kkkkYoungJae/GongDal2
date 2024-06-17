import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useUserInfo } from '@/hooks/useUserInfo';
import { updateNotification } from '@/services/notification';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { parseAxiosError } from '@/utils/factory';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

const NotificationSettingScreen = () => {
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();
  const { userInfo, setUserInfoState } = useUserInfo();

  const toggleSwitch = async () => {
    try {
      await updateNotification(!userInfo.notice);
      setUserInfoState({ ...userInfo, notice: !userInfo.notice });
    } catch (err) {
      parseAxiosError(err);
    }
  };

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title="알림 설정"
      />
      <ScrollView>
        <View style={styles.itemWrapper}>
          <Text subtitle2 style={{ flex: 1, paddingLeft: 6 }}>
            알림
          </Text>
          <Switch onValueChange={toggleSwitch} value={userInfo.notice} />
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default NotificationSettingScreen;

const styles = StyleSheet.create({
  itemWrapper: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f3f5',
    marginVertical: 4,
    borderRadius: 16,
    marginHorizontal: 24,
  },
});
