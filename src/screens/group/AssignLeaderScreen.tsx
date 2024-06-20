import images from '@/assets/images';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useGroup } from '@/hooks/useGroup';
import { useUserInfo } from '@/hooks/useUserInfo';
import { assignLeader, assignSubLeader, getGroupMember } from '@/services/group';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { IGroupMember, groupRole } from '@/types/group';
import { Routes } from '@/types/navigation';
import { debounce, parseAxiosError } from '@/utils/factory';
import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const AssignLeaderScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.AssignLeaderScreen>();
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { group, setCurrentGroupUsers } = useGroup();
  const { userInfo } = useUserInfo();

  const [selectUser, setSelectUser] = useState<IGroupMember>();

  const filterList = useMemo(
    () =>
      params.type === groupRole.subLeader
        ? group.currentGroupUsers?.users.content.filter(
            (user) => user.userId !== userInfo.userId && user.role !== 'subLeader',
          )
        : group.currentGroupUsers?.users.content.filter((user) => user.userId !== userInfo.userId),
    [],
  );

  const title = {
    leader: '방장 변경하기',
    subLeader: '부방장 지정하기',
    member: '',
  };

  const handleSubLeader = async () => {
    try {
      if (!group.currentGroup || !selectUser) return;

      await assignSubLeader({ groupId: group.currentGroup?.groupId, targetId: selectUser.userId });

      setCurrentGroupUsers(await getGroupMember(group.currentGroup?.groupId));
      navigation.goBack();
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const handleLeader = async () => {
    try {
      if (!group.currentGroup || !selectUser) return;

      await new Promise((resolve, reject) => {
        Alert.alert(
          '',
          `${selectUser.nickname}님으로 방장을 변경하시겠습니까?\n가지고 있던 모든 권한이 사라집니다.`,
          [
            {
              text: '취소',
              style: 'cancel',
              onPress: () => reject('cancel request'),
            },
            {
              text: '변경하기',
              style: 'destructive',
              onPress: () => resolve(true),
            },
          ],
          { cancelable: true },
        );
      });

      await assignLeader({ groupId: group.currentGroup?.groupId, targetId: selectUser.userId });

      setCurrentGroupUsers(await getGroupMember(group.currentGroup?.groupId));
      navigation.pop(2);
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: IGroupMember }) => {
      let bgColor = '';
      if (item.role === groupRole.leader) bgColor = '#FF76CE';
      else if (item.role === groupRole.subLeader) bgColor = '#FDDE55';

      return (
        <TouchableOpacity onPress={() => setSelectUser(item)} style={styles.itemWrapper}>
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

          <Icon
            icon="Ionicons"
            color={selectUser?.userId === item.userId ? group.currentGroup?.color : undefined}
            name={selectUser?.userId === item.userId ? 'radio-button-on' : 'radio-button-off'}
          />
        </TouchableOpacity>
      );
    },
    [selectUser],
  );

  const onSubmit = debounce(() => {
    params.type === groupRole.leader ? handleLeader() : handleSubLeader();
  });

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title={title[params.type]}
        right="완료"
        onPressRight={onSubmit}
      />

      <FlatList data={filterList} renderItem={renderItem} />
    </MainLayout>
  );
};

export default AssignLeaderScreen;

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
