import lotties from '@/assets/lotties';
import { useLoadingState } from '@/atoms/loadingState';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import TextInput from '@/components/TextInput';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { searchGroupInfo } from '@/services/group';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { delay, parseAxiosError, showAlert } from '@/utils/factory';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface FormData {
  search: string;
}

const GroupSearchScreen = () => {
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: { search: 'AWZG8923' },
  });
  const { palette } = useUIKitTheme();
  const { setLoadingState } = useLoadingState();

  const [isDirty, setIsDirty] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      if (data.search.length !== 8) return showAlert({ content: '그룹 키값을 다시 확인해주세요.' });

      setLoadingState(true);

      await searchGroupInfo(data.search);

      // navigation.replace(Routes.GroupFrontDoorScreen, { groupKey: data.search });
    } catch (err) {
      parseAxiosError(err);
    } finally {
      await delay(1000);
      setIsDirty(true);
      setLoadingState(false);
    }
  };

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        underline
        onPressLeft={() => navigation.goBack()}
        title="그룹 검색"
      />
      {isDirty ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <LottieView
            source={lotties.empty_search}
            style={{ width: 200, height: 200 }}
            autoPlay
            loop
          />
          <Text subtitle1 style={{ marginVertical: 12 }}>
            검색 결과 없음
          </Text>
          <Text color={palette.grey200}>입력하신 키를 다시 확인해주세요.</Text>
        </View>
      ) : (
        <ScrollView keyboardDismissMode="on-drag">
          <View style={{ padding: 24 }}>
            <Controller
              name="search"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="그룹 키값을 입력해 주세요."
                  onBlur={onBlur}
                  maxLength={8}
                  onChangeText={onChange}
                  value={value}
                  style={{
                    borderWidth: 1,
                    borderColor: palette.grey300,
                    paddingHorizontal: 8,
                    height: 50,
                  }}
                />
              )}
            />
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={{
                backgroundColor: palette.primary,
                alignItems: 'center',
                padding: 16,
                marginTop: 16,
              }}
            >
              <Text h2 color={palette.white}>
                검색
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </MainLayout>
  );
};

export default GroupSearchScreen;

const styles = StyleSheet.create({});
