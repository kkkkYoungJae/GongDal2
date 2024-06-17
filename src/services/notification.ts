import { INotification } from '@/types/notification';
import { PagedResponse } from '@/types/page';
import api from './api';

export const getNotifications = (page = 0) => {
  return new Promise<PagedResponse<INotification>>(async (resolve, reject) => {
    try {
      const { data } = await api.get(`/v1/notice?page=${page}`);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const readNotifications = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.post('/v1/notice/status');
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateNotification = (notice: boolean) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.post('/v1/notice', { notice });
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};
