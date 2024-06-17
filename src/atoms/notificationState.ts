import { INotificationState } from '@/types/notification';
import { atom } from 'recoil';

const initialState: INotificationState = {
  notifications: null,
  notRead: false,
};

export const notificationState = atom<INotificationState>({
  key: 'notificationState',
  default: initialState,
});
