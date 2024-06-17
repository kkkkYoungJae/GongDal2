import images from '@/assets/images';
import ActionSheet, { IActionSheetItem } from '@/components/ActionSheet';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useUserInfo } from '@/hooks/useUserInfo';
import { deleteMyProfileImage, getUserInfo, updateUserInfo } from '@/services/auth';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { Routes } from '@/types/navigation';
import { delay, isIOS, parseAxiosError } from '@/utils/factory';
import { useRef, useState } from 'react';
import {
  ActionSheetIOS,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import { Modalize } from 'react-native-modalize';

const MyInfoScreen = () => {
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();
  const { userInfo, setUserInfoState } = useUserInfo();

  const actionSheetRef = useRef<Modalize>(null);

  const [actionSheetItem, setActionSheetItem] = useState<IActionSheetItem[]>([]);

  const openImageLibrary = async () => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        selectionLimit: 1,
        presentationStyle: 'pageSheet',
        assetRepresentationMode: 'current',
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
      };

      launchImageLibrary(options, async (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const asset: Asset = response.assets[0];

          const formData = new FormData();

          const _image: any = {
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
          };

          formData.append('multipartFile', _image);
          formData.append('request', JSON.stringify({}));

          await updateUserInfo(formData);
          await setUserInfoState(await getUserInfo());
        }
      });
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const handleProfileActionSheet = () => {
    const actions: any = {
      '앨범에서 사진 선택하기': async () => {
        if (!isIOS) {
          actionSheetRef.current?.close();
          await delay(300);
        }

        openImageLibrary();
      },
      '기본 이미지 적용': async () => {
        if (!isIOS) {
          actionSheetRef.current?.close();
          await delay(300);
        }
        await deleteMyProfileImage();
        setUserInfoState({ ...userInfo, profile: null });
      },
    };

    const options = ['앨범에서 사진 선택하기', '기본 이미지 적용', '취소'];

    try {
      if (isIOS) {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex: 2,
          },
          (buttonIndex: number) => {
            actions[options[buttonIndex]]?.();
          },
        );
      } else {
        setActionSheetItem([
          {
            title: '앨범에서 사진 선택하기',
            icon: <Icon name="image-outline" icon="MaterialCommunityIcons" />,
            onPress: () => actions['앨범에서 사진 선택하기']?.(),
          },
          {
            title: '기본 이미지 적용',
            icon: <Icon name="image-off-outline" icon="MaterialCommunityIcons" />,
            onPress: () => actions['기본 이미지 적용']?.(),
          },
        ]);
        actionSheetRef.current?.open();
      }
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const ItemButton = ({ text, onPress }: { text: string; onPress: () => void }) => (
    <TouchableHighlight
      onPress={onPress}
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      style={{
        height: '100%',
        paddingHorizontal: 24,
        justifyContent: 'center',
      }}
    >
      <Text>{text}</Text>
    </TouchableHighlight>
  );

  const ITEMS = [
    {
      left: '닉네임',
      center: userInfo.nickname,
      right: (
        <ItemButton text="변경" onPress={() => navigation.navigate(Routes.ChangeNicknameScreen)} />
      ),
    },
    { left: '이메일', center: userInfo.loginId },
    {
      left: '생년월일',
      center: userInfo.birth,
      right: (
        <ItemButton
          text={userInfo.birth ? '변경' : '미입력'}
          onPress={() => navigation.navigate(Routes.ChangeBirthScreen)}
        />
      ),
    },
  ];

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title="내 정보 관리"
      />
      <ScrollView style={{ backgroundColor: palette.background }}>
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={handleProfileActionSheet}
            style={{ alignItems: 'center', padding: 30 }}
          >
            <View>
              <FastImage
                style={{ width: 120, height: 120, borderRadius: 1000, marginBottom: 16 }}
                source={
                  userInfo.profile
                    ? { uri: 'data:image/png;base64,' + userInfo.profile }
                    : images.logo
                }
              />
              <View
                style={{
                  backgroundColor: palette.white,
                  borderRadius: 1000,
                  position: 'absolute',
                  right: 0,
                  bottom: 16,
                  padding: 8,
                }}
              >
                <Icon icon="MaterialIcons" name="camera-alt" size={16} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={[
            {
              backgroundColor: palette.white,
            },
            styles.contentContainer,
          ]}
        >
          <Text h3 style={{ marginBottom: 16, paddingLeft: 24 }}>
            기본정보
          </Text>

          {ITEMS.map((item) => (
            <View key={item.left} style={styles.row}>
              <Text body2 style={styles.left}>
                {item.left}
              </Text>
              <Text body3 style={styles.center}>
                {item.center}
              </Text>
              {item.right}
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 40 }}>
          <TouchableOpacity
            style={{ borderWidth: 1, borderColor: palette.red, padding: 8, borderRadius: 8 }}
          >
            <Text body2 color={palette.red}>
              공달이 탈퇴하기
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ActionSheet ref={actionSheetRef} items={actionSheetItem} />
    </MainLayout>
  );
};

export default MyInfoScreen;

const styles = StyleSheet.create({
  contentContainer: {
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    paddingTop: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    height: 50,
    paddingLeft: 24,
  },
  left: {
    marginRight: 16,
  },
  center: {
    flex: 1,
  },
});
