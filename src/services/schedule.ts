import { IGetAllScheduleRequest, ISchedule, IScheduleDetail } from '@/types/schedule';
import api from './api';

export const createSchedule = (req: FormData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.post('/v1/schedule', req, {
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

export const updateSchedule = (scheduleId: number, req: FormData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.post(`/v1/schedule/${scheduleId}`, req, {
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

export const deleteSchedule = (scheduleId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.delete(`/v1/schedule/${scheduleId}`);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteSchedulePicture = (scheduleId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.delete(`/v1/schedule/info/${scheduleId}`);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllSchedule = (req: IGetAllScheduleRequest) => {
  return new Promise<ISchedule[]>(async (resolve, reject) => {
    try {
      const { data } = await api.post('/v1/schedule/user', req);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getScheduleDetail = (scheduleId: number) => {
  return new Promise<IScheduleDetail>(async (resolve, reject) => {
    try {
      const { data } = await api.get(`/v1/schedule/detail/${scheduleId}`);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};
