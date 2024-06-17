import { useLoadingState } from '@/atoms/loadingState';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import TextInput from '@/components/TextInput';
import MainLayout from '@/components/layouts/MainLayout';
import { asyncStorageKeys } from '@/constants/asyncStorage';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useGroup } from '@/hooks/useGroup';
import { useNotification } from '@/hooks/useNotification';
import { useSchedule } from '@/hooks/useSchedule';
import { useUserInfo } from '@/hooks/useUserInfo';
import useValidation from '@/hooks/useValidation';
import { emailLogin, getUserInfo, signUp } from '@/services/auth';
import { getMyGroups } from '@/services/group';
import { getNotifications } from '@/services/notification';
import { getAllSchedule } from '@/services/schedule';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { showAlert } from '@/utils/factory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

type FormData = {
  loginId: string;
  password: string;
};

const SignUpEmailScreen = () => {
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { setNotificationState } = useNotification();
  const { navigation } = useAppNavigation();
  const { setLoadingState } = useLoadingState();
  const { handleSubmit, control } = useForm<FormData>();
  const { isEmailValid, isPasswordValid } = useValidation();
  const { setUserInfoState } = useUserInfo();
  const { setScheduleState } = useSchedule();
  const { setGroupState } = useGroup();

  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleEmailSignup = async (data: FormData) => {
    try {
      const { loginId, password } = data;
      setLoadingState(true);
      if (!isEmailValid(loginId)) {
        return showAlert({ content: '이메일을 확인해주세요!' });
      }
      if (!isPasswordValid(password)) {
        return showAlert({ content: '비밀번호 양식을 확인해주세요!' });
      }

      const fcmToken = await messaging().getToken();

      await signUp({ loginId, password });

      await emailLogin({
        loginId,
        password,
        fcmToken,
      });

      await initialize();

      Toast.show({
        position: 'bottom',
        type: 'success',
        text1: '회원가입에 성공했습니다.',
      });
    } catch (err) {
      console.log(err);
      Alert.alert('안내', '회원가입에 실패했습니다. 다시 시도해주세요.', [{ text: '확인' }]);
    } finally {
      setLoadingState(false);
    }
  };

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
      await setNotificationState(await getNotifications());
      await setGroupState(await getMyGroups());
    } catch (err) {
      console.log('initialize err :', err);
      await AsyncStorage.removeItem(asyncStorageKeys.accessToken);
      await AsyncStorage.removeItem(asyncStorageKeys.refreshToken);
    }
  };

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
      />
      <View style={{ padding: 24 }}>
        <Text body1 style={{ paddingBottom: 40 }}>
          회원가입을 완료해주세요
        </Text>
        <Controller
          name="loginId"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="이메일"
              onBlur={onBlur}
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
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View
              style={{
                marginTop: 16,
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: palette.grey300,
                borderWidth: 1,
                paddingHorizontal: 16,
                height: 50,
              }}
            >
              <TextInput
                placeholder="비밀번호"
                onBlur={onBlur}
                onChangeText={onChange}
                maxLength={16}
                value={value}
                secureTextEntry={secureTextEntry}
                style={{
                  height: 50,
                  flex: 1,
                }}
              />
              <TouchableOpacity
                onPress={() => setSecureTextEntry((prev) => !prev)}
                style={{
                  height: '100%',
                  justifyContent: 'center',
                  paddingLeft: 8,
                }}
              >
                <Text caption3>{secureTextEntry ? '보기' : '숨기기'}</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <Text caption3 color={palette.red} style={{ marginTop: 12 }}>
          * 영문 + 숫자 + @$!%*#?& 포함 8 ~ 16자
        </Text>

        <TouchableOpacity
          onPress={handleSubmit(handleEmailSignup)}
          style={{
            marginTop: 16,
            backgroundColor: palette.blue,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text body2 color={palette.white}>
            회원가입
          </Text>
        </TouchableOpacity>
      </View>
    </MainLayout>
  );
};

export default SignUpEmailScreen;
