import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { Routes } from '@/types/navigation';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const TermsListScreen = () => {
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();

  const ITEMS: {
    title: string;
    onPress: () => void;
  }[] = [
    {
      title: '개인정보 처리방침',
      onPress: () =>
        navigation.navigate(Routes.TermsScreen, {
          title: '개인정보 처리방침',
          type: 'privacy',
        }),
    },
    {
      title: '서비스 이용약관',
      onPress: () =>
        navigation.navigate(Routes.TermsScreen, { title: '서비스 이용약관', type: 'service' }),
    },
  ];

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title="약관 및 정책"
      />
      <ScrollView>
        {ITEMS.map((item) => (
          <TouchableOpacity key={item.title} onPress={item.onPress} style={styles.itemWrapper}>
            <Text subtitle2 style={{ flex: 1, paddingLeft: 6 }}>
              {item.title}
            </Text>
            <Icon icon="Ionicons" name="chevron-forward" color={palette.grey200} size={16} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </MainLayout>
  );
};

export default TermsListScreen;

const styles = StyleSheet.create({
  itemWrapper: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f3f5',
    marginVertical: 4,
    borderRadius: 16,
    marginHorizontal: 24,
  },
});
