import images from '@/assets/images';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useGroup } from '@/hooks/useGroup';
import { useUserInfo } from '@/hooks/useUserInfo';
import { assignSubLeader, getGroupMember } from '@/services/group';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { IGroupMember, groupRole } from '@/types/group';
import { Routes } from '@/types/navigation';
import { parseAxiosError } from '@/utils/factory';
import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const GroupSubLeaderScreen = () => {
  const { navigation } = useAppNavigation<Routes.GroupSubLeaderScreen>();
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { group, setCurrentGroupUsers } = useGroup();
  const { userInfo } = useUserInfo();

  const filterList = useMemo(
    () =>
      group.currentGroupUsers?.users.content.filter(
        (user) => user.userId !== userInfo.userId && user.role === 'subLeader',
      ),
    [group.currentGroupUsers],
  );

  const handleSubLeader = async (targetId: number) => {
    try {
      if (!group.currentGroup) return;

      await assignSubLeader({ groupId: group.currentGroup?.groupId, targetId });

      setCurrentGroupUsers(await getGroupMember(group.currentGroup?.groupId));
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const renderItem = useCallback(({ item }: { item: IGroupMember }) => {
    let bgColor = '';
    if (item.role === groupRole.leader) bgColor = '#FF76CE';
    else if (item.role === groupRole.subLeader) bgColor = '#FDDE55';

    return (
      <View style={styles.itemWrapper}>
        <View style={{ marginRight: 8 }}>
          <FastImage
            style={styles.itemImage}
            resizeMode="cover"
            source={item.profile ? { uri: 'data:image/png;base64,' + item.profile } : images.logo}
          />
          {bgColor && (
            <View
              style={{
                backgroundColor: bgColor,
                ...styles.itemBadge,
              }}
            >
              <Icon icon="AntD" name="star" color="#fff" size={10} />
            </View>
          )}
        </View>
        <Text subtitle3 style={{ flex: 1 }}>
          {item.nickname}
        </Text>

        <TouchableOpacity style={styles.btnWrapper} onPress={() => handleSubLeader(item.userId)}>
          <Text body2>해제</Text>
        </TouchableOpacity>
      </View>
    );
  }, []);

  const onSubmit = () => {};

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title="부방장 지정/해제"
        onPressRight={onSubmit}
      />

      {filterList && filterList?.length > 0 ? (
        <>
          <Text subtitle1 style={{ padding: 16 }}>
            부방장은 그룹 멤버 내보내기와 그룹 정보를 변경 할 수 있습니다.
          </Text>
          <FlatList data={filterList} renderItem={renderItem} />
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text h1 style={{ marginBottom: 6 }}>
              지정한 부방장이 없습니다.
            </Text>
            <Text body3>부방장은 그룹 멤버 내보내기와 그룹 정보를 변경 할 수 있습니다.</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(Routes.AssignLeaderScreen, { type: groupRole.subLeader })
            }
            style={{
              backgroundColor: '#eee',
              alignItems: 'center',
              padding: 16,
              margin: 16,
              borderRadius: 16,
            }}
          >
            <Text subtitle1>부방장 지정하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </MainLayout>
  );
};

export default GroupSubLeaderScreen;

const styles = StyleSheet.create({
  itemWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    padding: 4,
  },
  btnWrapper: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderColor: '#ccc',
  },
});
