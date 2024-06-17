import images from '@/assets/images';
import ActionSheet, { IActionSheetItem } from '@/components/ActionSheet';
import ColorPicker from '@/components/ColorPicker';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useGroup } from '@/hooks/useGroup';
import { useSchedule } from '@/hooks/useSchedule';
import { useUserInfo } from '@/hooks/useUserInfo';
import { deleteGroup, deleteGroupCover, getMyGroups, updateGroup } from '@/services/group';
import { getAllSchedule } from '@/services/schedule';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { groupRole } from '@/types/group';
import { Routes } from '@/types/navigation';
import { delay, isIOS, parseAxiosError } from '@/utils/factory';
import { useRef, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import { Modalize } from 'react-native-modalize';

const GroupSettingScreen = () => {
  const { navigation } = useAppNavigation();
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { group, updateGroupState, setGroupState } = useGroup();
  const { userInfo } = useUserInfo();
  const { setScheduleState } = useSchedule();

  const colorPickerRef = useRef<Modalize>(null);
  const actionSheetRef = useRef<Modalize>(null);

  const [colorValue, setColorValue] = useState(group.currentGroup?.color);

  const [actionSheetItem, setActionSheetItem] = useState<IActionSheetItem[]>([]);

  const openImageLibrary = async () => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        selectionLimit: 1,
        presentationStyle: 'pageSheet',
        assetRepresentationMode: 'current',
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
      };

      launchImageLibrary(options, async (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          if (!group.currentGroup) return;

          const asset: Asset = response.assets[0];

          const formData = new FormData();

          const _image: any = {
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
          };

          formData.append('multipartFile', _image);
          formData.append('request', JSON.stringify({}));

          await updateGroup(group.currentGroup?.groupId, formData);

          updateGroupState({ ...group.currentGroup, cover: asset.uri });
        }
      });
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const handleCoverActionSheet = () => {
    const actions: any = {
      '앨범에서 사진 선택하기': async () => {
        if (!isIOS) {
          actionSheetRef.current?.close();
          await delay(300);
        }

        openImageLibrary();
      },
      '기본 이미지 적용': async () => {
        if (!isIOS) {
          actionSheetRef.current?.close();
          await delay(300);
        }
        if (!group.currentGroup) return;

        if (group.currentGroup?.cover) {
          await deleteGroupCover(group.currentGroup?.groupId);
          updateGroupState({ ...group.currentGroup, cover: '' });
        }
      },
    };

    const options = ['앨범에서 사진 선택하기', '기본 이미지 적용', '취소'];

    try {
      if (isIOS) {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex: 2,
          },
          (buttonIndex: number) => {
            actions[options[buttonIndex]]?.();
          },
        );
      } else {
        setActionSheetItem([
          {
            title: '앨범에서 사진 선택하기',
            icon: <Icon name="image-outline" icon="MaterialCommunityIcons" />,
            onPress: () => actions['앨범에서 사진 선택하기']?.(),
          },
          {
            title: '기본 이미지 적용',
            icon: <Icon name="image-off-outline" icon="MaterialCommunityIcons" />,
            onPress: () => actions['기본 이미지 적용']?.(),
          },
        ]);
        actionSheetRef.current?.open();
      }
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const handleColorPicker = async (color: string) => {
    try {
      if (colorValue === color || !group.currentGroup) {
        colorPickerRef.current?.close();
        return;
      }

      const formData = new FormData();
      formData.append('request', JSON.stringify({ color }));
      await updateGroup(group.currentGroup?.groupId, formData);

      updateGroupState({ ...group.currentGroup, color });

      setColorValue(color);
      colorPickerRef.current?.close();
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      if (!group.currentGroup) return;

      await new Promise((resolve, reject) => {
        Alert.alert(
          '',
          '이 그룹을 삭제하시겠습니까?\n삭제한 그룹은 복구가 불가능합니다.',
          [
            {
              text: '취소',
              style: 'cancel',
              onPress: () => reject('cancel request'),
            },
            {
              text: '그룹 삭제',
              style: 'destructive',
              onPress: () => resolve(true),
            },
          ],
          { cancelable: true },
        );
      });

      await deleteGroup(group.currentGroup.groupId);
      await setScheduleState(
        await getAllSchedule({
          start: '2024-01-01',
          end: '2025-12-31',
        }),
      );
      await setGroupState(await getMyGroups());
      navigation.pop(2);
    } catch (err) {
      parseAxiosError(err);
    }
  };

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
      />

      <ScrollView>
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <Pressable onPress={handleCoverActionSheet} style={{ alignItems: 'center', padding: 30 }}>
            <View>
              <FastImage
                style={{ width: 100, height: 100, borderRadius: 1000, marginBottom: 16 }}
                source={
                  group.currentGroup?.cover
                    ? { uri: 'data:image/png;base64,' + group.currentGroup?.cover }
                    : images.logo
                }
              />
              <View
                style={{
                  backgroundColor: '#eee',
                  borderRadius: 1000,
                  position: 'absolute',
                  right: 0,
                  bottom: 16,
                  padding: 8,
                }}
              >
                <Icon icon="MaterialIcons" name="camera-alt" size={16} />
              </View>
            </View>
          </Pressable>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate(Routes.ChangeGroupInfoScreen, { type: 'name' })}
          style={styles.itemContainer}
        >
          <Text subtitle2>그룹 이름</Text>
          <Text body3 color={palette.grey600} style={{ marginTop: 6 }}>
            {group.currentGroup?.name}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate(Routes.ChangeGroupInfoScreen, { type: 'description' })}
          style={styles.itemContainer}
        >
          <Text subtitle2>그룹 설명</Text>
          <Text body3 color={palette.grey600} style={{ marginTop: 6 }}>
            {group.currentGroup?.description}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => colorPickerRef.current?.open()}
          style={[
            styles.itemContainer,
            { justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' },
          ]}
        >
          <Text subtitle2>그룹 색상</Text>
          <TouchableOpacity
            onPress={() => colorPickerRef.current?.open()}
            style={{ padding: 8, borderRadius: 4, backgroundColor: colorValue }}
          >
            <Text style={{ opacity: 0 }}>코드 없음</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {group.currentGroupUsers?.auth && (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.GroupSubLeaderScreen)}
              style={styles.itemContainer}
            >
              <Text subtitle2>부방장 지정/해제</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Routes.AssignLeaderScreen, { type: groupRole.leader })
              }
              style={styles.itemContainer}
            >
              <Text subtitle2>방장 변경하기</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 48 }}>
              <TouchableOpacity
                onPress={handleDeleteGroup}
                style={{ borderWidth: 1, borderColor: palette.red, padding: 8, borderRadius: 8 }}
              >
                <Text body2 color={palette.red}>
                  그룹 삭제하기
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <ColorPicker ref={colorPickerRef} color={colorValue} onPress={handleColorPicker} />
      <ActionSheet ref={actionSheetRef} items={actionSheetItem} />
    </MainLayout>
  );
};

export default GroupSettingScreen;

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});
