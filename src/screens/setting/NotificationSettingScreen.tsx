import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { asyncStorageKeys } from '@/constants/asyncStorage';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

const NotificationSettingScreen = () => {
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useLayoutEffect(() => {
    (async () => {
      const res = await AsyncStorage.getItem(asyncStorageKeys.pushAlram);
      setIsEnabled(res === 'true');
    })();
  }, []);

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
          <Switch onValueChange={toggleSwitch} value={isEnabled} />
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
