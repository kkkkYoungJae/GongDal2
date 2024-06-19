import images from '@/assets/images';
import { useLoadingState } from '@/atoms/loadingState';
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
import { emailLogin, getUserInfo, socialLogin } from '@/services/auth';
import { getMyGroups } from '@/services/group';
import { getNotifications } from '@/services/notification';
import { getAllSchedule } from '@/services/schedule';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { Routes } from '@/types/navigation';
import { isIOS, parseAxiosError, showAlert } from '@/utils/factory';
import { WEB_CLIENT_ID } from '@env';
import appleAuth from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { login } from '@react-native-seoul/kakao-login';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';

type FormData = {
  email: string;
  password: string;
};

const SignInScreen = () => {
  const { navigation } = useAppNavigation();
  const { palette } = useUIKitTheme();
  const { setLoadingState } = useLoadingState();
  const { setUserInfoState } = useUserInfo();
  const { setScheduleState } = useSchedule();
  const { setGroupState } = useGroup();
  const { setNotificationState } = useNotification();
  const { isEmailValid } = useValidation();
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [authMode, setAuthMode] = useState<'social' | 'email'>('social');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
      scopes: ['profile', 'email'],
    });
  }, []);

  const handleKakaoSignin = async () => {
    try {
      setLoadingState(true);

      const { idToken } = await login();
      const fcmToken = await messaging().getToken();

      const { accessToken, refreshToken } = await socialLogin({
        idToken,
        fcmToken,
        type: 'K',
      });

      await AsyncStorage.setItem(asyncStorageKeys.accessToken, accessToken);
      await AsyncStorage.setItem(asyncStorageKeys.refreshToken, refreshToken);

      await initialize();

      Toast.show({
        position: 'bottom',
        type: 'success',
        text1: '로그인에 성공했습니다.',
      });
    } catch (err) {
      parseAxiosError(err);
    } finally {
      setLoadingState(false);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      setLoadingState(true);

      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();

      if (!idToken) throw new Error('idToken is required');

      const fcmToken = await messaging().getToken();

      const { accessToken, refreshToken } = await socialLogin({
        idToken,
        fcmToken,
        type: 'G',
      });

      await AsyncStorage.setItem(asyncStorageKeys.accessToken, accessToken);
      await AsyncStorage.setItem(asyncStorageKeys.refreshToken, refreshToken);

      await initialize();

      Toast.show({
        position: 'bottom',
        type: 'success',
        text1: '로그인에 성공했습니다.',
      });
    } catch (err) {
      parseAxiosError(err);
    } finally {
      setLoadingState(false);
    }
  };

  const handleAppleSignin = async () => {
    try {
      setLoadingState(true);

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      const { identityToken } = appleAuthRequestResponse;

      if (!identityToken) throw new Error('idToken is required');

      const fcmToken = await messaging().getToken();

      const { accessToken, refreshToken } = await socialLogin({
        idToken: identityToken,
        fcmToken,
        type: 'A',
      });

      await AsyncStorage.setItem(asyncStorageKeys.accessToken, accessToken);
      await AsyncStorage.setItem(asyncStorageKeys.refreshToken, refreshToken);

      await initialize();

      Toast.show({
        position: 'bottom',
        type: 'success',
        text1: '로그인에 성공했습니다.',
      });
    } catch (err) {
      parseAxiosError(err);
    } finally {
      setLoadingState(false);
    }
  };

  const handleEmailSignin = async (data: FormData) => {
    try {
      setLoadingState(true);

      if (!isEmailValid(data.email)) return showAlert({ content: '이메일을 다시 확인해주세요.' });

      const fcmToken = await messaging().getToken();

      const { accessToken, refreshToken } = await emailLogin({
        fcmToken,
        loginId: data.email,
        password: data.password,
      });

      await AsyncStorage.setItem(asyncStorageKeys.accessToken, accessToken);
      await AsyncStorage.setItem(asyncStorageKeys.refreshToken, refreshToken);

      await initialize();

      Toast.show({
        position: 'bottom',
        type: 'success',
        text1: '로그인에 성공했습니다.',
      });
    } catch (err) {
      console.log(err);
      Alert.alert('안내', '로그인에 실패했습니다. 다시 시도해주세요.', [{ text: '확인' }]);
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
      await setGroupState(await getMyGroups());
      await setNotificationState(await getNotifications());
    } catch (err) {
      console.log('initialize err :', err);
      await AsyncStorage.removeItem(asyncStorageKeys.accessToken);
      await AsyncStorage.removeItem(asyncStorageKeys.refreshToken);
    }
  };

  const Social = () => (
    <>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <FastImage
          style={{
            height: 100,
            width: 100,
          }}
          source={images.logo}
        />
      </View>

      <TouchableOpacity
        onPress={handleKakaoSignin}
        style={[
          styles.buttonWrapper,
          {
            backgroundColor: '#ffe137',
            marginVertical: 6,
          },
        ]}
      >
        <FastImage style={{ height: 24, width: 24 }} source={images.kakao} />
        <Text h2 style={{ flex: 1, textAlign: 'center', paddingVertical: 16 }}>
          카카오로 계속하기
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleGoogleSignin}
        style={[
          styles.buttonWrapper,
          {
            borderWidth: 1,
            borderColor: palette.grey200,
            backgroundColor: palette.white,
            marginVertical: 6,
          },
        ]}
      >
        <FastImage style={{ height: 24, width: 24 }} source={images.google} />
        <Text h2 style={{ flex: 1, textAlign: 'center', paddingVertical: 16 }}>
          구글로 계속하기
        </Text>
      </TouchableOpacity>
      {isIOS && (
        <TouchableOpacity
          onPress={handleAppleSignin}
          style={[
            styles.buttonWrapper,
            {
              backgroundColor: palette.black,
              marginVertical: 6,
            },
          ]}
        >
          <FastImage style={{ height: 24, width: 24 }} source={images.apple_white} />

          <Text
            h2
            color={palette.white}
            style={{ flex: 1, textAlign: 'center', paddingVertical: 16 }}
          >
            애플로 계속하기
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => setAuthMode('email')}
        style={[
          styles.buttonWrapper,
          {
            borderWidth: 1,
            borderColor: palette.grey200,
            backgroundColor: palette.white,
            marginVertical: 6,
          },
        ]}
      >
        <FastImage style={{ height: 24, width: 24 }} source={images.email} />
        <Text h2 style={{ flex: 1, textAlign: 'center', paddingVertical: 16 }}>
          이메일로 계속하기
        </Text>
      </TouchableOpacity>
    </>
  );

  const Email = () => (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text h1 style={{ marginVertical: 24 }}>
          로그인
        </Text>
        <Text body2>이메일과 비밀번호를 입력하세요.</Text>
      </View>
      <Controller
        name="email"
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
          <TextInput
            placeholder="비밀번호"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
            style={{
              borderWidth: 1,
              marginTop: 16,
              borderColor: palette.grey300,
              paddingHorizontal: 16,
              height: 50,
            }}
          />
        )}
      />

      <TouchableOpacity
        onPress={handleSubmit(handleEmailSignin)}
        style={{
          marginTop: 16,
          backgroundColor: palette.blue,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text body2 color={palette.white}>
          로그인
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(Routes.SignUpTermsScreen)}
        style={{
          marginTop: 16,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <Text caption2 style={{ marginRight: 6 }}>
          계정이 없으신가요?
        </Text>
        <Text caption1>계정 생성</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={handleKakaoSignin}
          style={[styles.smallBtnWrapper, { backgroundColor: '#ffe137' }]}
        >
          <FastImage style={styles.smallLogo} source={images.kakao} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleGoogleSignin}
          style={[
            styles.smallBtnWrapper,
            { borderWidth: 1, borderColor: palette.grey200, backgroundColor: palette.white },
          ]}
        >
          <FastImage style={styles.smallLogo} source={images.google} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleAppleSignin}
          style={[styles.smallBtnWrapper, { backgroundColor: palette.black }]}
        >
          <FastImage style={styles.smallLogo} source={images.apple_white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <MainLayout>
      <View style={{ padding: 24, flex: 1, justifyContent: 'flex-end' }}>
        {authMode === 'social' ? <Social /> : <Email />}
      </View>
    </MainLayout>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  smallBtnWrapper: {
    borderRadius: 100,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  smallLogo: {
    height: 24,
    width: 24,
  },
});
