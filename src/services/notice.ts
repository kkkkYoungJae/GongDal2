import { INotice } from '@/types/notice';
import { PagedResponse } from '@/types/page';
import api from './api';

export const getNotices = (page = 0) => {
  return new Promise<PagedResponse<INotice>>(async (resolve, reject) => {
    try {
      const { data } = await api.get(`/v1/news/list?page=${page}`);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};
