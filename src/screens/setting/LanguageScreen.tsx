import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { ScrollView, StyleSheet } from 'react-native';

const LanguageScreen = () => {
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title="언어 설정"
      />
      <ScrollView style={{ padding: 24 }}>
        <Text>gg</Text>
      </ScrollView>
    </MainLayout>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({});
