import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useQueryKey } from '@/constants/useQueryKey';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { getNotices } from '@/services/notice';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet } from 'react-native';

const NoticesScreen = () => {
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();

  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    data,
  } = useInfiniteQuery({
    queryKey: [useQueryKey.notices],
    queryFn: ({ pageParam = 0 }) => getNotices(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.number + 1,
  });

  console.log(data);

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title="공지사항"
      />
      <ScrollView style={{ padding: 24 }}>
        <Text>gg</Text>
      </ScrollView>
    </MainLayout>
  );
};

export default NoticesScreen;

const styles = StyleSheet.create({});
