import RootNavigator from '@/navigation/RootNavigator';
import { setCurrentScreen } from '@/utils/log';
import { KAKAO_APP_KEY } from '@env';
import messaging from '@react-native-firebase/messaging';
import {
  DarkTheme,
  DefaultTheme,
  LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRef, useCallback, useEffect } from 'react';
import { Alert, DeviceEventEmitter, Linking, LogBox, StatusBar } from 'react-native';
import codePush, { CodePushOptions } from 'react-native-code-push';
import 'react-native-console-time-polyfill';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import QuickActions, { ShortcutItem } from 'react-native-quick-actions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, { BaseToast, ToastConfig } from 'react-native-toast-message';
import { RecoilRoot } from 'recoil';
import Header from './components/Header';
import LoadingIndicator from './components/LoadingIndicator';
import useAppearance from './hooks/useAppearance';
import usePermissions from './hooks/usePermissions';
import { HeaderStyleProvider } from './styles/HeaderStyleContext';
import DarkUIKitTheme from './theme/DarkUIKitTheme';
import LightUIKitTheme from './theme/LightUIKitTheme';
import UIKitThemeProvider from './theme/UIKitThemeProvider';
import { ParamListBase, Routes } from './types/navigation';
import { GetTranslucent } from './utils/factory';

QuickActions.setShortcutItems([
  {
    type: '새로운 일정',
    title: '새로운 일정',
    icon: 'Compose',
    userInfo: {
      url: 'schedule',
    },
  },
]);

export const navigationRef = createRef<any>();
export const routeNameRef: React.MutableRefObject<NavigationContainerRef<any> | null> = createRef();

LogBox.ignoreLogs([
  'Excessive number of pending callbacks', // 'Excessive number of pending callbacks' 무시
]);

const App = () => {
  const { hasRequestedPermission } = usePermissions();
  const { scheme } = useAppearance();
  const isLightTheme = scheme === 'light';

  const queryClient = new QueryClient();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  const handleQuickAction = useCallback(
    (data: ShortcutItem | null) => {
      if (data) {
        navigationRef.current.navigate(Routes.ScheduleCreateScreen, {});
      }
    },
    [navigationRef],
  );

  const handleDeepLink = (url: string | null) => {
    console.log('url', url);
    if (!url) return;
    const route = url.replace(/.*?:\/\//g, '');
    const routeName = route.split('/')[0];

    // if (routeName === 'details') {
    //   navigationRef.current?.navigate('Details');
    // }
  };

  useEffect(() => {
    const linkingListener = Linking.addEventListener('url', (e) => {
      handleDeepLink(e.url);
    });

    const quickActionListener = DeviceEventEmitter.addListener(
      'quickActionShortcut',
      handleQuickAction,
    );

    return () => {
      linkingListener.remove();
      quickActionListener.remove();
    };
  }, []);

  const toastConfig: ToastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftWidth: 0, backgroundColor: '#292d33' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: '400',
          fontFamily: 'Pretendard-Bold',
          color: '#fff',
        }}
      />
    ),
  };

  const linking: LinkingOptions<ParamListBase> = {
    prefixes: [`kakao${KAKAO_APP_KEY}://`],
    config: {
      screens: {
        GroupFrontDoorScreen: 'kakaolink',
      },
    },
  };

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <UIKitThemeProvider theme={isLightTheme ? LightUIKitTheme : DarkUIKitTheme}>
              <HeaderStyleProvider
                HeaderComponent={Header}
                defaultTitleAlign="center"
                statusBarTranslucent={GetTranslucent() || false}
              >
                <StatusBar barStyle={!isLightTheme ? 'light-content' : 'dark-content'} />
                <NavigationContainer
                  ref={navigationRef}
                  linking={linking}
                  onReady={() =>
                    (routeNameRef.current = navigationRef.current.getCurrentRoute()?.name)
                  }
                  theme={isLightTheme ? DefaultTheme : DarkTheme}
                  onStateChange={() => {
                    const previousRouteName = routeNameRef.current;
                    const currentRouteName = navigationRef.current.getCurrentRoute().name;

                    if (previousRouteName !== currentRouteName) {
                      setCurrentScreen(currentRouteName);
                    }
                    routeNameRef.current = currentRouteName;
                  }}
                >
                  <Host>
                    <RootNavigator />
                    <LoadingIndicator />
                  </Host>
                </NavigationContainer>
                <Toast config={toastConfig} />
              </HeaderStyleProvider>
            </UIKitThemeProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

const codePushOptions: CodePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
};

// export default codePush(codePushOptions)(App);
export default App;
