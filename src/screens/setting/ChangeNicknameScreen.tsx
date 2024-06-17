import { useLoadingState } from '@/atoms/loadingState';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import TextInput from '@/components/TextInput';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useUserInfo } from '@/hooks/useUserInfo';
import { updateUserInfo } from '@/services/auth';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { delay } from '@/utils/factory';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface FormData {
  nickname: string;
}

const ChangeNicknameScreen = () => {
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();

  const { userInfo, setUserInfoState } = useUserInfo();
  const { setLoadingState } = useLoadingState();

  const { handleSubmit, control, watch, setFocus } = useForm<FormData>({
    defaultValues: { nickname: userInfo.nickname },
  });

  useEffect(() => {
    (async () => {
      Platform.OS !== 'ios' && (await delay(300));
      setFocus('nickname');
    })();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      if (data.nickname === userInfo.nickname) {
        navigation.goBack();
        Toast.show({
          position: 'bottom',
          type: 'success',
          text1: '내 정보를 변경했습니다.',
        });
        return;
      }

      setLoadingState(true);

      const formData = new FormData();
      formData.append('request', JSON.stringify(data));

      await updateUserInfo(formData);
      setUserInfoState({ ...userInfo, nickname: data.nickname });

      navigation.goBack();
      Toast.show({
        position: 'bottom',
        type: 'success',
        text1: '내 정보를 변경했습니다.',
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title="닉네임 변경"
      />
      <ScrollView keyboardDismissMode="on-drag">
        <View style={{ padding: 24 }}>
          <Controller
            name="nickname"
            control={control}
            render={({ field: { ref, onChange, onBlur, value } }) => (
              <TextInput
                ref={ref}
                placeholder="닉네임을 입력해 주세요."
                onBlur={onBlur}
                maxLength={20}
                onChangeText={onChange}
                value={value}
                style={{
                  borderWidth: 1,
                  borderColor: palette.grey300,
                  paddingHorizontal: 16,
                  height: 50,
                }}
              />
            )}
          />
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={!watch('nickname')}
            style={{
              backgroundColor: watch('nickname') ? palette.primary : palette.grey300,
              alignItems: 'center',
              padding: 16,
              marginTop: 16,
            }}
          >
            <Text h2 color={palette.white}>
              닉네임 변경하기
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default ChangeNicknameScreen;
