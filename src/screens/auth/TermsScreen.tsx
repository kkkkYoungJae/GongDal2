import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { terms_privacy, terms_service } from '@/constants/terms';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import useHeaderStyle from '@/styles/useHeaderStyle';
import { Routes } from '@/types/navigation';
import { ScrollView, View } from 'react-native';

const TermsScreen = () => {
  const { HeaderComponent } = useHeaderStyle();
  const { navigation, params } = useAppNavigation<Routes.TermsScreen>();

  const terms = { privacy: terms_privacy, service: terms_service };

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title={params.title}
      />
      <ScrollView>
        <View style={{ padding: 16 }}>
          <Text>{terms[params.type]}</Text>
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default TermsScreen;
