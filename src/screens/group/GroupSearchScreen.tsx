import { useLoadingState } from '@/atoms/loadingState';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import TextInput from '@/components/TextInput';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { searchGroupInfo } from '@/services/group';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { Routes } from '@/types/navigation';
import { showAlert } from '@/utils/factory';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface FormData {
  search: string;
}

const GroupSearchScreen = () => {
  const { HeaderComponent } = useHeaderStyle();
  const { navigation } = useAppNavigation();
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: { search: 'WNMW1973' },
  });
  const { palette } = useUIKitTheme();
  const { setLoadingState } = useLoadingState();

  const onSubmit = async (data: FormData) => {
    try {
      if (data.search.length !== 8) return showAlert({ content: '그룹 키값을 다시 확인해주세요.' });

      setLoadingState(true);

      const group = await searchGroupInfo(data.search);

      navigation.navigate(Routes.GroupFrontDoorScreen, { group });
    } catch (err) {
      console.log(err);
    } finally {
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
          <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ padding: 16 }}>
            <Text>검색</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default GroupSearchScreen;

const styles = StyleSheet.create({});
