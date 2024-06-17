import images from '@/assets/images';
import Text from '@/components/Text';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useGroup } from '@/hooks/useGroup';
import { useSchedule } from '@/hooks/useSchedule';
import { exitGroup, getMyGroups } from '@/services/group';
import { getAllSchedule } from '@/services/schedule';
import {
  IGetGroupMemberResponse,
  IGroupMember,
  ISearchGroupResponse,
  groupRole,
} from '@/types/group';
import { Routes } from '@/types/navigation';
import { fDate, parseAxiosError } from '@/utils/factory';
import { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Icon from '../Icon';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  groupMember?: IGetGroupMemberResponse | null;
  groupInfo: ISearchGroupResponse | null;
  onEndReached?: () => void;
}

const GroupSettingSidebar = ({
  isVisible,
  onClose,
  groupMember,
  groupInfo,
  onEndReached,
}: Props) => {
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [slideAnim] = useState(new Animated.Value(width));
  const { navigation } = useAppNavigation();
  const { setGroupState } = useGroup();
  const { setScheduleState } = useSchedule();

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const onPressGroupSetting = async () => {
    navigation.navigate(Routes.GroupSettingScreen);
  };

  const onPressLeaveGroup = async () => {
    try {
      if (!groupInfo) return;

      await new Promise((resolve, reject) => {
        Alert.alert(
          '',
          '이 그룹을 나가시겠습니까?',
          [
            {
              text: '취소',
              style: 'cancel',
              onPress: () => reject('cancel request'),
            },
            {
              text: '그룹 나가기',
              style: 'destructive',
              onPress: () => resolve(true),
            },
          ],
          { cancelable: true },
        );
      });

      await exitGroup(groupInfo?.groupId);
      await setScheduleState(
        await getAllSchedule({
          start: '2024-01-01',
          end: '2025-12-31',
        }),
      );
      await setGroupState(await getMyGroups());
      navigation.goBack();
      Toast.show({
        position: 'bottom',
        type: 'success',
        text1: '그룹을 탈퇴했습니다.',
      });
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const renderItem = ({ item }: { item: IGroupMember }) => {
    let bgColor = '';
    if (item.role === groupRole.leader) bgColor = '#FF76CE';
    else if (item.role === groupRole.subLeader) bgColor = '#FDDE55';

    return (
      <TouchableOpacity style={styles.itemWrapper}>
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
        <Text subtitle3>{item.nickname}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={isVisible} transparent onRequestClose={closeSidebar} animationType="fade">
      <Pressable style={styles.overlay} onPress={closeSidebar} />
      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }], paddingTop: top }]}
      >
        <FlatList
          data={groupMember?.users.content}
          renderItem={renderItem}
          keyExtractor={(item) => item.userId + ''}
          onEndReachedThreshold={32}
          onEndReached={onEndReached}
          ListHeaderComponent={
            <View>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, padding: 16 }}
              >
                <View
                  style={{
                    width: 5,
                    height: '100%',
                    backgroundColor: groupInfo?.color || 'lightblue',
                    borderRadius: 100,
                    marginRight: 12,
                  }}
                />
                <View>
                  <Text subtitle1 style={{ marginBottom: 6 }}>
                    {groupInfo?.name}
                  </Text>
                  <Text body2>{groupInfo?.key}</Text>
                </View>
              </View>

              <Text body3 style={{ marginBottom: 16, paddingHorizontal: 16 }}>
                개설일 {fDate(groupInfo?.createDate)}
              </Text>

              <Text subtitle2 style={{ padding: 16 }}>
                참여목록
              </Text>

              <TouchableOpacity
                onPress={() => {
                  if (!groupInfo) return;
                  closeSidebar();
                  navigation.navigate(Routes.GroupInviteScreen, {
                    name: groupInfo?.name,
                    key: groupInfo?.key,
                  });
                }}
                style={[styles.itemWrapper]}
              >
                <View style={{ marginRight: 8 }}>
                  <View
                    style={[styles.itemImage, { backgroundColor: groupInfo?.color || 'lightblue' }]}
                  >
                    <Icon icon="Ionicons" name="add" size={28} color={'#fff'} />
                  </View>
                </View>
                <Text h3>그룹 멤버 초대하기</Text>
              </TouchableOpacity>
            </View>
          }
        />
        <View
          style={{
            paddingBottom: bottom,
            ...styles.footerContainer,
          }}
        >
          <TouchableOpacity onPress={onPressLeaveGroup} style={{ padding: 16 }}>
            <Text h3>나가기</Text>
          </TouchableOpacity>

          {groupMember?.kick && (
            <TouchableOpacity
              onPress={() => {
                closeSidebar();
                onPressGroupSetting();
              }}
              style={{ padding: 16 }}
            >
              <Icon icon="Ionicons" name="settings-outline" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
};

export default GroupSettingSidebar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0, // 오른쪽에서 시작하도록 설정
    width: '80%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
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
  footerContainer: {
    backgroundColor: '#efefef',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
