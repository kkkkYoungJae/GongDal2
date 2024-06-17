import images from '@/assets/images';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useUserInfo } from '@/hooks/useUserInfo';
import { logout } from '@/services/auth';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { Routes } from '@/types/navigation';
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import Mailer from 'react-native-mail';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SettingScreen = () => {
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();
  const { top, bottom } = useSafeAreaInsets();
  const { palette } = useUIKitTheme();
  const { userInfo, setUserInfoState } = useUserInfo();

  const handleEmail = async () => {
    Mailer.mail(
      {
        subject: '[공달이] 문의하기',
        recipients: ['dudwodla123@gmail.com'],
        body: `<b>내용 :</b><br/><br/><br/><br/>
        <b>앱 버전 : </b> ${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})<br/>
        <b>디바이스 : </b> ${Platform.OS}<br/>
        <b>디바이스버전 : </b> ${DeviceInfo.getSystemVersion()}<br/>`,
        isHTML: true,
      },
      (_, event) => {
        if (event === 'sent') {
          Alert.alert('문의하기', '메일이 전송되었습니다.', [{ text: '확인' }]);
        }
      },
    );
  };

  const ITEMS = [
    {
      title: '공지사항',
      onPress: () => navigation.navigate(Routes.NoticesScreen),
    },
    { title: '문의하기', onPress: handleEmail },
    { title: '알림 설정', onPress: () => navigation.navigate(Routes.NotificationSettingScreen) },
    // { title: '언어 설정', onPress: () => navigation.navigate(Routes.LanguageScreen) },
    { title: '약관 및 정책', onPress: () => navigation.navigate(Routes.TermsListScreen) },
    { title: '버전 정보', onPress: () => navigation.navigate(Routes.AppVersionScreen) },
  ];

  const MyInfo = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate(Routes.MyInfoScreen)}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 32,
        },
      ]}
    >
      <FastImage
        style={{ width: 60, height: 60, borderRadius: 1000, marginRight: 12 }}
        source={
          userInfo.profile ? { uri: 'data:image/png;base64,' + userInfo.profile } : images.logo
        }
      />
      <View style={{ flex: 1 }}>
        <Text subtitle1 style={{ marginBottom: 6 }}>
          {userInfo.nickname}
        </Text>
        <Text body2 color={palette.grey200}>
          {userInfo.loginId}
        </Text>
      </View>
      <Icon icon="Ionicons" name="chevron-forward" color={palette.grey200} size={16} />
    </TouchableOpacity>
  );

  return (
    <MainLayout style={{ backgroundColor: palette.background }}>
      <ScrollView>
        <MyInfo />

        {ITEMS.map((item) => (
          <TouchableOpacity key={item.title} onPress={item.onPress} style={styles.itemWrapper}>
            <Text subtitle2 style={{ flex: 1, paddingLeft: 6 }}>
              {item.title}
            </Text>
            <Icon icon="Ionicons" name="chevron-forward" color={palette.grey200} size={16} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => logout(setUserInfoState)}
          style={[styles.itemWrapper, { justifyContent: 'center', marginTop: 12 }]}
        >
          <Text h2 color={palette.red}>
            로그아웃
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </MainLayout>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  itemWrapper: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 4,
    borderRadius: 6,
    marginHorizontal: 24,
  },
});
