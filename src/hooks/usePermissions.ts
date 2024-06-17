import { asyncStorageKeys } from '@/constants/asyncStorage';
import { delay } from '@/utils/factory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from 'react';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import { requestTrackingPermission } from 'react-native-tracking-transparency';

const usePermissions = () => {
  const [hasRequestedPermission, setHasRequestedPermission] = useState<boolean | undefined>(
    undefined,
  );

  const requestPermissions = async () => {
    try {
      // Firebase 권한 요청
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        const newPushAlram = enabled ? 'true' : 'false';
        await AsyncStorage.setItem(asyncStorageKeys.pushAlram, newPushAlram);
      }

      // FCM 토큰 요청
      const fcmToken = await messaging().getToken();

      // console.log(fcmToken);

      // 기타 권한 요청
      await delay(1000);
      await requestTrackingPermission();

      const response = await requestMultiple([
        PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
        PERMISSIONS.IOS.CALENDARS,
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
        PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
        PERMISSIONS.ANDROID.READ_CALENDAR,
        PERMISSIONS.ANDROID.WRITE_CALENDAR,
        PERMISSIONS.ANDROID.CAMERA,
      ]);

      const allGranted = Object.values(response).every((value) => value === 'granted');
      setHasRequestedPermission(allGranted);
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setHasRequestedPermission(false);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return { hasRequestedPermission };
};

export default usePermissions;
