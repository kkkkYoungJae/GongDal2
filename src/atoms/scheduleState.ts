import { IScheduleState } from '@/types/schedule';
import { atom } from 'recoil';

const initialState: IScheduleState = {
  scheduleByDate: {},
  scheduleByGroupId: {},
};

export const scheduleState = atom<IScheduleState>({
  key: 'scheduleState',
  default: initialState,
});
