import images from '@/assets/images';
import { useLoadingState } from '@/atoms/loadingState';
import ActionSheet, { IActionSheetItem } from '@/components/ActionSheet';
import ColorPicker from '@/components/ColorPicker';
import Icon from '@/components/Icon';
import Prompt from '@/components/Prompt';
import Text from '@/components/Text';
import TextInput from '@/components/TextInput';
import MainLayout from '@/components/layouts/MainLayout';
import { GROUP_COLORS } from '@/constants/colorPallete';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import useValidation from '@/hooks/useValidation';
import { createGroup } from '@/services/group';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { Routes } from '@/types/navigation';
import { debounce, delay, isIOS, parseAxiosError, showAlert } from '@/utils/factory';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActionSheetIOS, ScrollView, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import { Modalize } from 'react-native-modalize';

interface FormData {
  name: string;
  description: string;
  password: string;
  color: string;
  image?: { uri?: string; type?: string; name?: string };
}

const GroupCreateScreen = () => {
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();
  const { palette } = useUIKitTheme();
  const { isGroupPasswordValid } = useValidation();
  const { setLoadingState } = useLoadingState();

  const colorPickerRef = useRef<Modalize>(null);
  const actionSheetRef = useRef<Modalize>(null);

  const { handleSubmit, control, setValue, getValues, watch } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      password: '',
      color: GROUP_COLORS[0],
      image: undefined,
    },
  });

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [actionSheetItem, setActionSheetItem] = useState<IActionSheetItem[]>([]);

  const onSubmit = debounce(async (data: FormData) => {
    try {
      setLoadingState(true);

      if (!data.name) return showAlert({ content: '그룹 이름을 입력해 주세요!' });
      if (!data.password) return showAlert({ content: '그룹 비밀번호를 입력해 주세요!' });

      const formData = new FormData();

      if (data.image) {
        const image: any = {
          uri: data.image.uri,
          type: data.image.type,
          name: data.image.name,
        };
        formData.append('multipartFile', image);
      }
      delete data.image;

      formData.append('request', JSON.stringify(data));

      const res = await createGroup(formData);

      navigation.replace(Routes.GroupInviteScreen, { ...res, name: data.name });
    } catch (err) {
      parseAxiosError(err);
    } finally {
      setLoadingState(false);
    }
  });

  const handlePasswordSubmit = (password: string) => {
    if (!isGroupPasswordValid(password)) {
      return showAlert({
        content: '코드를 잘못 입력했습니다.\n영문/숫자 4~8자리로 입력해 주세요.',
      });
    }
    setValue('password', password);
    setIsShowPassword(false);
  };

  const handlePasswordCancle = () => {
    setIsShowPassword(false);
  };

  const handleColorPicker = (color: string) => {
    setValue('color', color);
    colorPickerRef.current?.close();
  };

  const openImageLibrary = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
      presentationStyle: 'pageSheet',
      assetRepresentationMode: 'current',
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset: Asset = response.assets[0];
        setValue('image', { name: asset.fileName, type: asset.type, uri: asset.uri });
      }
    });
  };

  const onPressActionButton = () => {
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
        setValue('image', undefined);
      },
    };

    const options = ['앨범에서 사진 선택하기', '기본 이미지 적용', '취소'];

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
  };

  const GroupImage = () => (
    <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
      <TouchableOpacity onPress={onPressActionButton} style={{ alignItems: 'center', padding: 30 }}>
        <View>
          <FastImage
            style={{ width: 120, height: 120, borderRadius: 1000, marginBottom: 16 }}
            source={watch('image') ? { uri: watch('image')?.uri } : images.logo}
          />
          <View
            style={{
              backgroundColor: '#eee',
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
  );

  const GroupTitle = () => (
    <View style={{ marginBottom: 32 }}>
      <Controller
        name="name"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="그룹 제목을 입력해 주세요."
            onBlur={onBlur}
            maxLength={20}
            onChangeText={onChange}
            value={value}
            style={{
              borderBottomWidth: 1,
              borderColor: palette.grey300,
              paddingHorizontal: 8,
              height: 50,
            }}
          />
        )}
      />
    </View>
  );

  const GroupDescription = () => (
    <View style={{ marginBottom: 32 }}>
      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="그룹 설명을 입력해 주세요."
            onBlur={onBlur}
            maxLength={20}
            onChangeText={onChange}
            value={value}
            style={{
              borderBottomWidth: 1,
              borderColor: palette.grey300,
              paddingHorizontal: 8,
              height: 50,
            }}
          />
        )}
      />
    </View>
  );

  const GroupPassword = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 32,
      }}
    >
      <Text body1>참여 코드</Text>
      <TouchableOpacity
        onPress={() => setIsShowPassword(true)}
        style={{ padding: 8, borderRadius: 4, backgroundColor: '#eee' }}
      >
        <Text>{getValues('password') || '코드 없음'}</Text>
      </TouchableOpacity>
    </View>
  );

  const GroupColor = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text body1>컬러테마</Text>
      <TouchableOpacity
        onPress={() => colorPickerRef.current?.open()}
        style={{ padding: 8, borderRadius: 4, backgroundColor: watch('color') }}
      >
        <Text style={{ opacity: 0 }}>코드 없음</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="close" />}
        title="그룹 만들기"
        onPressLeft={() => navigation.goBack()}
        right="저장"
        onPressRight={handleSubmit(onSubmit)}
      />

      <ScrollView keyboardDismissMode="on-drag">
        <View style={{ paddingHorizontal: 24 }}>
          <GroupImage />
          <GroupTitle />
          <GroupDescription />
          <GroupPassword />
          <GroupColor />
        </View>
      </ScrollView>

      <Prompt
        title="참여 코드 입력"
        description={'그룹에 참여하려면 참여 코드가 필요합니다.\n참여 코드를 입력해 주세요.'}
        visible={isShowPassword}
        placeholder="영문/숫자 4~8자리"
        onSumbit={handlePasswordSubmit}
        onCancel={handlePasswordCancle}
      />

      <ColorPicker ref={colorPickerRef} color={getValues('color')} onPress={handleColorPicker} />

      <ActionSheet ref={actionSheetRef} items={actionSheetItem} />
    </MainLayout>
  );
};

export default GroupCreateScreen;
