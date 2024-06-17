import { PagedResponse } from './page';

export interface INotification {
  id: number;
  message: string;
  active: boolean;
  scheduleId: number;
  createDate: string;
  type: '일정' | '댓글' | '대댓글';
  userId: number;
}

export interface INotificationState {
  notifications: PagedResponse<INotification> | null;
  notRead: boolean;
}
