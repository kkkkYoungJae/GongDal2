import images from '@/assets/images';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useGroup } from '@/hooks/useGroup';
import { getMyGroups, searchGroupInfo } from '@/services/group';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { IGroup } from '@/types/group';
import { Routes } from '@/types/navigation';
import { parseAxiosError } from '@/utils/factory';
import { useState } from 'react';
import { RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import FastImage from 'react-native-fast-image';

const GroupScreen = () => {
  const { defaultHeight } = useHeaderStyle();
  const { navigation } = useAppNavigation();
  const { palette } = useUIKitTheme();
  const { group, setGroupState, setCurrentGroup } = useGroup();

  const [isLoading, setIsLoading] = useState(false);

  const refetch = async () => {
    try {
      setIsLoading(true);
      await setGroupState(await getMyGroups());
    } catch (err) {
      parseAxiosError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onPressGroupItem = async (item: IGroup) => {
    try {
      setCurrentGroup({ ...(await searchGroupInfo(item.key)), key: item.key });
      navigation.navigate(Routes.GroupDetailScreen);
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<IGroup>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          onPress={() => onPressGroupItem(item)}
        >
          <View
            style={{
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: palette.white,
              marginHorizontal: 16,
              marginVertical: 8,
              borderRadius: 16,
            }}
          >
            <FastImage
              style={{
                width: 50,
                height: 50,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#eee',
                marginRight: 12,
              }}
              resizeMode="cover"
              source={item.cover ? { uri: 'data:image/png;base64,' + item.cover } : images.logo}
            />
            <View style={{ flex: 1 }}>
              <Text subtitle1 numberOfLines={1} ellipsizeMode="tail" style={{ marginBottom: 4 }}>
                {item.name}
              </Text>
              <Text>방장 : {item.leaderNickname}</Text>
            </View>
            <Icon icon="Ionicons" name="chevron-forward" color={palette.grey200} />
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <MainLayout style={{ backgroundColor: palette.background }}>
      <View
        style={{
          height: defaultHeight,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.GroupSearchScreen)}
            style={{ padding: 16, paddingRight: 8 }}
          >
            <Icon icon="Ionicons" name="search" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.GroupCreateScreen)}
            style={{ padding: 16, paddingLeft: 8 }}
          >
            <Icon icon="Ionicons" name="add" />
          </TouchableOpacity>
        </View>
      </View>

      <DraggableFlatList
        data={group.groups}
        renderItem={renderItem}
        containerStyle={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 8 }}
        keyExtractor={(item) => String(item.groupId)}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      />
    </MainLayout>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({});
