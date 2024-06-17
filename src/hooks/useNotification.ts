import { notificationState } from '@/atoms/notificationState';
import { INotification } from '@/types/notification';
import { PagedResponse } from '@/types/page';
import { useRecoilState } from 'recoil';

export const useNotification = () => {
  const [notification, setNotification] = useRecoilState(notificationState);

  const setNotificationState = (events: PagedResponse<INotification>) => {
    setNotification({ notifications: events, notRead: events.content?.[0]?.active === false });
  };

  const updateNotificationState = (events: PagedResponse<INotification>) => {
    setNotification((prev) => ({
      ...prev,
      notifications: {
        ...events,
        content: [...(prev.notifications?.content || []), ...events.content],
      },
    }));
  };

  return { notification, setNotificationState, updateNotificationState };
};
