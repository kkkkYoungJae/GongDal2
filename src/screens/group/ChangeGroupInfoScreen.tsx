import Icon from '@/components/Icon';
import Text from '@/components/Text';
import TextInput from '@/components/TextInput';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useGroup } from '@/hooks/useGroup';
import { updateGroup } from '@/services/group';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { Routes } from '@/types/navigation';
import { debounce, delay, parseAxiosError, showToast } from '@/utils/factory';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native';

interface FormData {
  name: string;
  description: string;
}

const ChangeGroupInfoScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.ChangeGroupInfoScreen>();
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { group, updateGroupState } = useGroup();

  const { handleSubmit, control, watch, setValue, setFocus } = useForm<FormData>({
    defaultValues: {
      name: group.currentGroup?.name,
      description: group.currentGroup?.description,
    },
  });

  const title = {
    name: '그룹 이름',
    description: '그룹 설명',
  };

  useEffect(() => {
    (async () => {
      Platform.OS !== 'ios' && (await delay(300));
      if (params.type === 'name') setFocus('name');
      else if (params.type === 'description') setFocus('description');
    })();
  }, []);

  const onSubmit = debounce(async (data: FormData) => {
    try {
      if (!group.currentGroup) {
        navigation.goBack();
        return;
      }
      if (params.type === 'name') {
        if (group.currentGroup?.name === data.name || data.name === '') {
          navigation.goBack();
          return;
        }
      }
      if (params.type === 'description') {
        if (group.currentGroup?.description === data.description || data.description === '') {
          navigation.goBack();
          return;
        }
      }

      const formData = new FormData();
      formData.append('request', JSON.stringify({ [params.type]: data[params.type] }));
      await updateGroup(group.currentGroup?.groupId, formData);

      const newData = { ...group.currentGroup, [params.type]: data[params.type] };

      updateGroupState(newData);
      navigation.goBack();
      showToast('그룹 정보를 변경했어요!');
    } catch (err) {
      parseAxiosError(err);
    }
  });

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title={title[params.type]}
        right="완료"
        onPressRight={handleSubmit(onSubmit)}
      />
      <ScrollView keyboardDismissMode="on-drag">
        <Controller
          name={params.type}
          control={control}
          render={({ field: { ref, onChange, onBlur, value } }) => (
            <View
              style={{
                margin: 16,
                borderBottomWidth: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TextInput
                ref={ref}
                placeholder={`${params.type === 'name' ? '제목' : '그룹 설명'}을 입력해 주세요.`}
                style={{ flex: 1 }}
                onBlur={onBlur}
                maxLength={20}
                onChangeText={onChange}
                value={value}
              />
              <TouchableOpacity
                onPress={() => setValue(params.type, '')}
                style={{
                  height: '100%',
                  flexDirection: 'row',
                  paddingHorizontal: 8,
                  alignItems: 'center',
                }}
              >
                <Icon icon="Ionicons" name="close-circle" size={20} color={palette.grey300} />
              </TouchableOpacity>
              <Text body3 color={palette.grey300}>
                {watch(params.type).length}/20
              </Text>
            </View>
          )}
        />

        <Text body3 style={{ marginHorizontal: 16 }}>
          최대 20자
        </Text>
      </ScrollView>
    </MainLayout>
  );
};

export default ChangeGroupInfoScreen;
