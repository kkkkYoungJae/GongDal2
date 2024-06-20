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
import { debounce, delay, formatDate, formatDateReverse } from '@/utils/factory';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface FormData {
  birth: string;
}

const ChangeBirthScreen = () => {
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();
  const { userInfo, setUserInfoState } = useUserInfo();
  const { setLoadingState } = useLoadingState();

  const { handleSubmit, control, watch, setFocus } = useForm<FormData>({
    defaultValues: { birth: userInfo.birth ? formatDateReverse(userInfo.birth) : '' },
  });

  useEffect(() => {
    (async () => {
      Platform.OS !== 'ios' && (await delay(300));
      setFocus('birth');
    })();
  }, []);

  const onSubmit = debounce(async (data: FormData) => {
    try {
      if (data.birth === userInfo.birth) {
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
      formData.append('request', JSON.stringify({ birth: formatDate(data.birth) }));

      await updateUserInfo(formData);
      setUserInfoState({ ...userInfo, birth: data.birth });
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
  });

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title="생년월일 변경"
      />
      <ScrollView keyboardDismissMode="on-drag">
        <View style={{ padding: 24 }}>
          <Controller
            name="birth"
            control={control}
            render={({ field: { ref, onChange, onBlur, value } }) => (
              <TextInput
                ref={ref}
                placeholder="생년월일 8자리 입력 (예: 19970101)"
                onBlur={onBlur}
                keyboardType="number-pad"
                maxLength={8}
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
            disabled={watch('birth').length !== 8}
            style={{
              backgroundColor: watch('birth').length === 8 ? palette.primary : palette.grey300,
              alignItems: 'center',
              padding: 16,
              marginTop: 16,
            }}
          >
            <Text h2 color={palette.white}>
              생년월일 변경하기
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default ChangeBirthScreen;
