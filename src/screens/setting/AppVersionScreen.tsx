import images from '@/assets/images';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { useEffect, useState } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import VersionCheck from 'react-native-version-check';

const AppVersionScreen = () => {
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();

  const [latestVersion, setLatestVersion] = useState('');
  const [storeUrl, setStoreUrl] = useState('');

  useEffect(() => {
    (() => {
      VersionCheck.needUpdate()
        .then((version) => {
          setLatestVersion(version.latestVersion);
          setStoreUrl(version.storeUrl);
        })
        .catch((error) => console.log(error));
    })();
  }, []);

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title="버전 정보"
      />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <FastImage source={images.logo} style={{ width: 100, height: 100, borderRadius: 16 }} />

        <Text subtitle2 style={{ marginTop: 16 }}>{`현재 버전 ${DeviceInfo.getVersion()}`}</Text>
        <Text subtitle2 style={{ marginTop: 16 }}>
          {latestVersion ? `최신 버전 ${latestVersion}` : '최신 버전입니다.'}
        </Text>

        {storeUrl && (
          <TouchableOpacity
            onPress={() => Linking.openURL(storeUrl)}
            style={{
              backgroundColor: '#f1f4f7',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 16,
              marginTop: 16,
            }}
          >
            <Text h2>업데이트가 필요합니다</Text>
          </TouchableOpacity>
        )}
      </View>
    </MainLayout>
  );
};

export default AppVersionScreen;
