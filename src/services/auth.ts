import { initialAuthState } from '@/atoms/authState';
import { asyncStorageKeys } from '@/constants/asyncStorage';
import {
  IAuthState,
  IEmailLoginRequest,
  ILoginResponse,
  IRefreshAuthTokenRequest,
  IRefreshAuthTokenResponse,
  ISignUpRequest,
  ISocialLoginRequest,
} from '@/types/auth';
import { parseAxiosError } from '@/utils/factory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import api from './api';

export const socialLogin = (req: ISocialLoginRequest): Promise<ILoginResponse> => {
  return new Promise<ILoginResponse>(async (resolve, reject) => {
    try {
      const { data } = await api.post('/v1/social', req);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const emailLogin = (req: IEmailLoginRequest): Promise<ILoginResponse> => {
  return new Promise<ILoginResponse>(async (resolve, reject) => {
    try {
      const { data } = await api.post('/v1/login', req);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const signUp = (req: ISignUpRequest) => {
  return new Promise<ILoginResponse>(async (resolve, reject) => {
    try {
      const { data } = await api.post('/v1/join', req);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const refreshAuthToken = (req: IRefreshAuthTokenRequest) => {
  return new Promise<IRefreshAuthTokenResponse>(async (resolve, reject) => {
    try {
      const { data } = await api.post('/v1/renew', req);

      await AsyncStorage.setItem(asyncStorageKeys.accessToken, data.data.accessToken);
      await AsyncStorage.setItem(asyncStorageKeys.refreshToken, data.data.refreshToken);

      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getUserInfo = async () => {
  return new Promise<IAuthState>(async (resolve, reject) => {
    try {
      const { data } = await api.get('/v1/info');
      resolve(data.data);
    } catch (error) {
      reject(error);
      console.log('Error fetching user info: ', error);
    }
  });
};

export const logout = async (setUserInfoState: (info: IAuthState) => void) => {
  try {
    await api.get('/v1/logout');
    setUserInfoState(initialAuthState);
    await messaging().deleteToken();
    await AsyncStorage.removeItem(asyncStorageKeys.accessToken);
    await AsyncStorage.removeItem(asyncStorageKeys.refreshToken);
  } catch (error) {
    parseAxiosError(error);
  }
};

export const updateUserInfo = async (request: FormData) => {
  return new Promise<IAuthState>(async (resolve, reject) => {
    try {
      const { data } = await api.post('/v1/info', request, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteMyProfileImage = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.delete('/v1/info');
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};
