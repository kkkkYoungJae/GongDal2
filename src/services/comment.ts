import { ICreateScheduleCommentRequest, IGetScheduleComment } from '@/types/comment';
import { PagedResponse } from '@/types/page';
import api from './api';

export const getScheduleComment = (scheduleId: number, page = 0) => {
  return new Promise<PagedResponse<IGetScheduleComment>>(async (resolve, reject) => {
    try {
      const { data } = await api.get(`/v1/comment/${scheduleId}?page=${page}`);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getScheduleReply = (scheduleId: number, commentId: number, page = 0) => {
  return new Promise<PagedResponse<IGetScheduleComment>>(async (resolve, reject) => {
    try {
      const { data } = await api.get(`/v1/comment/${scheduleId}/${commentId}?page=${page}`);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const createScheduleComment = (scheduleId: number, req: ICreateScheduleCommentRequest) => {
  return new Promise<IGetScheduleComment>(async (resolve, reject) => {
    try {
      const { data } = await api.post(`/v1/comment/${scheduleId}`, req);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateScheduleComment = (commentId: number, content: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.put(`/v1/comment/${commentId}`, { content });
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteScheduleComment = (commentId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.delete(`/v1/comment/${commentId}`);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};
