import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useQueryKey } from '@/constants/useQueryKey';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { getNotices } from '@/services/notice';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { INotice } from '@/types/notice';
import { fDate } from '@/utils/factory';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';

const NoticesScreen = () => {
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();

  const { hasNextPage, fetchNextPage, data } = useInfiniteQuery({
    queryKey: [useQueryKey.notices],
    queryFn: ({ pageParam = 0 }) => getNotices(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.last) return lastPage.number + 1;
    },
  });

  const onEndReached = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title="공지사항"
      />
      <FlatList
        data={data?.pages.flatMap((page) => page.content) || []}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={onEndReached}
      />
    </MainLayout>
  );
};

export default NoticesScreen;

const Item = ({ item }: { item: INotice }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { palette } = useUIKitTheme();

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsCollapsed((prev) => !prev)}
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderColor: palette.grey300,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text body4 color={palette.grey200} style={{ marginBottom: 6 }}>
            {fDate(item.createDate)}
          </Text>
          <Text body2>{item.title}</Text>
        </View>
        <View>
          <Icon
            icon="Ionicons"
            name={isCollapsed ? 'chevron-down-outline' : 'chevron-up-outline'}
            size={16}
          />
        </View>
      </TouchableOpacity>

      <Collapsible collapsed={isCollapsed}>
        <View style={{ padding: 16, backgroundColor: palette.grey100 }}>
          <Text>{item.content}</Text>
        </View>
      </Collapsible>
    </View>
  );
};
