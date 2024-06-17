import lotties from '@/assets/lotties';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import NotificationItem from '@/components/notification/NotificationItem';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useNotification } from '@/hooks/useNotification';
import { getNotifications, readNotifications } from '@/services/notification';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { Routes } from '@/types/navigation';
import { INotification } from '@/types/notification';
import { parseAxiosError } from '@/utils/factory';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NotificationScreen = () => {
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();
  const { top, bottom } = useSafeAreaInsets();
  const { palette } = useUIKitTheme();
  const { notification, setNotificationState, updateNotificationState } = useNotification();

  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          await setNotificationState(await getNotifications());
          await readNotifications();
        } catch (err) {
          parseAxiosError(err);
        }
      })();
    }, []),
  );

  const refetch = async () => {
    try {
      setIsLoading(true);
      await setNotificationState(await getNotifications());
    } catch (err) {
      parseAxiosError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onPressNotificationItem = (item: INotification) => {
    navigation.navigate(Routes.ScheduleDetailScreen, { scheduleId: item.scheduleId });
  };

  const renderItem = useCallback(({ item }: { item: INotification }) => {
    return <NotificationItem item={item} onPress={() => onPressNotificationItem(item)} />;
  }, []);

  const onEndReached = async () => {
    if (notification.notifications?.last) return;

    try {
      await updateNotificationState(
        await getNotifications((notification.notifications?.number || 0) + 1),
      );
    } catch (err) {
      parseAxiosError(err);
    }
  };

  return (
    <MainLayout>
      <HeaderComponent title="알림" />

      {(notification.notifications?.content || []).length > 0 ? (
        <FlatList
          data={notification.notifications?.content}
          renderItem={renderItem}
          onEndReached={onEndReached}
          keyExtractor={(item) => item.id + ''}
          onEndReachedThreshold={32}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <LottieView
            source={lotties.empty_notification}
            style={{ width: 200, height: 200 }}
            autoPlay
            loop
          />
          <Text subtitle1 style={{ marginVertical: 12 }}>
            알림 없음
          </Text>
          <Text color={palette.grey200}>여기에서 공유 목록의 소식을 확인 할 수 있습니다.</Text>
        </View>
      )}
    </MainLayout>
  );
};

export default NotificationScreen;
