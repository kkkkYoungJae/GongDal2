import lotties from '@/assets/lotties';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { DEFAULT_SCALE_FACTOR } from '@/styles/createScaleFactor';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { Routes } from '@/types/navigation';
import LottieView from 'lottie-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import KakaoShareLink from 'react-native-kakao-share-link';

const GroupInviteScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.GroupInviteScreen>();
  const { palette } = useUIKitTheme();

  const onShare = async () => {
    try {
      await KakaoShareLink.sendText({
        text: `안녕하세요! 공달이 앱에 초대합니다.
함께 일정을 공유하고 소통할 수 있는 새로운 캘린더 [${params.name}]가 생성되었어요. 
아래 링크를 클릭하면 바로 참여할 수 있습니다. 📅✨`,
        link: {
          webUrl: 'https://developers.kakao.com/',
          mobileWebUrl: 'https://developers.kakao.com/',
        },
        buttons: [
          {
            title: '앱에서 보기',
            link: {
              androidExecutionParams: [{ key: 'groupKey', value: params.key }],
              iosExecutionParams: [{ key: 'groupKey', value: params.key }],
              webUrl: 'https://developers.kakao.com/',
              mobileWebUrl: 'https://developers.kakao.com/',
            },
          },
        ],
      });
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <MainLayout>
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <LottieView source={lotties.invite} style={{ width: 300, height: 300 }} autoPlay loop />

        <Text h1 style={{ fontSize: DEFAULT_SCALE_FACTOR(24), marginBottom: 12 }}>
          멤버 초대하기
        </Text>
        <Text body3 color={palette.grey500} style={{ textAlign: 'center', marginBottom: 24 }}>
          {'초대 메시지를 보내고\n상대방이 참가 버튼을 누르면\n작업이 완료됩니다.'}
        </Text>

        <TouchableOpacity
          onPress={onShare}
          style={[styles.btnWrapper, { backgroundColor: palette.green }]}
        >
          <Text color={palette.white}>초대 메시지 보내기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigation.goBack}
          style={[styles.btnWrapper, { borderWidth: 1, borderColor: palette.green }]}
        >
          <Text color={palette.green}>닫기</Text>
        </TouchableOpacity>
      </View>
    </MainLayout>
  );
};

export default GroupInviteScreen;

const styles = StyleSheet.create({
  btnWrapper: {
    padding: 16,
    flexDirection: 'row',
    width: 300,
    justifyContent: 'center',
    borderRadius: 16,
    marginVertical: 8,
  },
});
