import { useLoadingState } from '@/atoms/loadingState';
import Icon from '@/components/Icon';
import Prompt from '@/components/Prompt';
import Spacer from '@/components/Spacer';
import Text from '@/components/Text';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import useValidation from '@/hooks/useValidation';
import { joinGroup, searchGroupInfo } from '@/services/group';
import { DEFAULT_SCALE_FACTOR } from '@/styles/createScaleFactor';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { ISearchGroupResponse } from '@/types/group';
import { Routes } from '@/types/navigation';
import { fDate, parseAxiosError, showAlert } from '@/utils/factory';
import { useLayoutEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GroupFrontDoorScreen = () => {
  const { palette } = useUIKitTheme();
  const { bottom, top } = useSafeAreaInsets();
  const { navigation, params } = useAppNavigation<Routes.GroupFrontDoorScreen>();
  const { isGroupPasswordValid } = useValidation();
  const { setLoadingState } = useLoadingState();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [groupInfo, setGroupInfo] = useState<ISearchGroupResponse>();

  useLayoutEffect(() => {
    (async () => {
      try {
        if (!params.groupKey) return;

        setGroupInfo(await searchGroupInfo(params.groupKey));
      } catch (err) {
        parseAxiosError(err);
      }
    })();
  }, []);

  const handlePasswordSubmit = async (password: string) => {
    try {
      if (!groupInfo) return;
      if (!isGroupPasswordValid(password)) {
        return showAlert({
          content: '코드를 잘못 입력했습니다.\n영문/숫자 4~8자리로 입력해 주세요.',
        });
      }

      setLoadingState(true);

      await joinGroup({ groupId: groupInfo?.groupId, password });
      console.log(password);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingState(false);
    }
  };

  const handlePasswordCancle = () => {
    setPasswordVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <FastImage
        style={{
          flex: 1,
          paddingTop: top,
          marginBottom: bottom,
          backgroundColor: groupInfo?.color,
        }}
        resizeMode="cover"
        source={
          groupInfo?.cover ? { uri: 'data:image/png;base64,' + groupInfo.cover } : { uri: '' }
        }
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </FastImage>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          paddingTop: top,
          paddingBottom: bottom,
        }}
      >
        <TouchableOpacity onPress={navigation.goBack} style={{ padding: 16 }}>
          <Icon icon="Ionicons" name="close" color={palette.white} size={36} />
        </TouchableOpacity>

        <Spacer />

        <View style={{ padding: 16, marginBottom: 50 }}>
          <Text
            h1
            color={palette.white}
            style={{ fontSize: DEFAULT_SCALE_FACTOR(24), marginBottom: 12 }}
          >
            {groupInfo?.name}
          </Text>
          <Text
            subtitle2
            color={palette.white}
            style={{ fontSize: DEFAULT_SCALE_FACTOR(20), marginBottom: 12 }}
          >
            {groupInfo?.description}
          </Text>
          <Text subtitle2 color={palette.white}>
            {`방장 : ${groupInfo?.leaderNickname}`}
          </Text>
          <Text body3 color={palette.grey300}>
            {`${groupInfo?.participants}/100명 | 개설일 ${fDate(groupInfo?.createDate)}`}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setPasswordVisible(true)}
          style={{
            backgroundColor: palette.primary500,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 18,
          }}
        >
          <Icon icon="Fontisto" name="locked" size={20} style={{ marginRight: 8 }} />
          <Text body1>그룹 참여하기</Text>
        </TouchableOpacity>

        <Prompt
          title="참여 코드 입력"
          description={'참여 코드 입력이 필요합니다.\n방장이 알려준 참여 코드를 입력해 주세요.'}
          visible={passwordVisible}
          placeholder="영문/숫자 4~8자리"
          onSumbit={handlePasswordSubmit}
          onCancel={handlePasswordCancle}
        />
      </View>
    </View>
  );
};

export default GroupFrontDoorScreen;

const styles = StyleSheet.create({});
