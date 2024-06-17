import { useAppNavigation } from '@/hooks/useAppNavigation';
import { TouchableOpacity, View } from 'react-native';
import Text from './Text';

const NotFoundPage = () => {
  const { navigation } = useAppNavigation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text subtitle1>앗! 페이지를 찾지 못했어요.</Text>
      <TouchableOpacity
        onPress={navigation.goBack}
        style={{ paddingHorizontal: 16, paddingVertical: 12, marginTop: 40, borderWidth: 2 }}
      >
        <Text h2>뒤로가기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotFoundPage;
