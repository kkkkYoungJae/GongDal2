import { API_PROD_URL } from '@env';

import { asyncStorageKeys } from '@/constants/asyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';
import { refreshAuthToken } from './auth';

const api: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: API_PROD_URL,
});

export default api;

api.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem(asyncStorageKeys.accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('expired token', error.response?.status);
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem(asyncStorageKeys.refreshToken);

      try {
        if (!refreshToken) throw new Error('not found refresh token');

        const newToken = await refreshAuthToken({ refreshToken });

        api.defaults.headers.common.Authorization = `Bearer ${newToken.accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;

        return axios(originalRequest);
      } catch (tokenRefreshError) {
        // 토큰 갱신 실패 시
        return Promise.reject(tokenRefreshError);
      }
    }

    return Promise.reject(error);
  },
);
