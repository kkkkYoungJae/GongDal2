import Icon from '@/components/Icon';
import Text from '@/components/Text';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { Routes } from '@/types/navigation';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const SignUpTermsScreen = () => {
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();

  const [checkTerms, setCheckTerms] = useState({ privacy: false, service: false });

  const handleAgreement = (type: 'privacy' | 'service' | 'all') => {
    if (type === 'all') {
      const allChecked = !Object.values(checkTerms).every((value) => value);
      setCheckTerms({ privacy: allChecked, service: allChecked });
    } else {
      setCheckTerms((prev) => ({ ...prev, [type]: !prev[type] }));
    }
  };

  const TERMS: {
    type: 'privacy' | 'service';
    title: string;
    onPress: () => void;
    onPressDetail: () => void;
  }[] = [
    {
      type: 'privacy',
      title: '(필수) 개인정보 처리방침',
      onPress: () => handleAgreement('privacy'),
      onPressDetail: () =>
        navigation.navigate(Routes.TermsScreen, {
          title: '개인정보 처리방침',
          type: 'privacy',
        }),
    },
    {
      type: 'service',
      title: '(필수) 서비스 이용약관',
      onPress: () => handleAgreement('service'),
      onPressDetail: () =>
        navigation.navigate(Routes.TermsScreen, { title: '서비스 이용약관', type: 'service' }),
    },
  ];

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
      />
      <ScrollView style={{ padding: 24 }}>
        <Text body1>{'회원가입을 위해\n이용약관에 동의해주세요.'}</Text>
        <Text caption3 color={palette.grey500} style={{ paddingBottom: 40 }}>
          {
            '본 제공동의를 거부할 권리가 있으나,\n동의를 거부하실 경우 서비스 이용이 제한될 수 있습니다.'
          }
        </Text>

        <TouchableOpacity
          onPress={() => handleAgreement('all')}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Icon
            icon="Ionicons"
            name="checkmark-circle"
            size={30}
            color={Object.values(checkTerms).every((value) => value) ? undefined : palette.grey300}
          />
          <Text caption1 color={palette.grey500} style={{ flex: 1, paddingLeft: 6 }}>
            모두 동의
          </Text>
        </TouchableOpacity>

        <View style={{ height: 1, backgroundColor: palette.grey200, marginVertical: 16 }} />
        {TERMS.map(({ type, title, onPress, onPressDetail }) => (
          <TouchableOpacity
            key={title}
            onPress={onPress}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Icon
              icon="Ionicons"
              name="checkmark-circle"
              size={30}
              color={checkTerms[type] ? undefined : palette.grey300}
            />
            <Text color={palette.grey500} style={{ flex: 1, paddingLeft: 6 }}>
              {title}
            </Text>

            <TouchableOpacity onPress={onPressDetail} style={{ padding: 12, paddingRight: 8 }}>
              <Text>보기</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => navigation.navigate(Routes.SignUpEmailScreen)}
          disabled={!Object.values(checkTerms).every((value) => value)}
          style={{
            marginTop: 16,
            backgroundColor: Object.values(checkTerms).every((value) => value)
              ? palette.blue
              : palette.grey200,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text body2 color={palette.white}>
            회원가입 하기
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </MainLayout>
  );
};

export default SignUpTermsScreen;

const styles = StyleSheet.create({});
