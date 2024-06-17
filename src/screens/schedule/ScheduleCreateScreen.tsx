import Icon from '@/components/Icon';
import Text from '@/components/Text';
import TextInput from '@/components/TextInput';
import GroupPickerModal from '@/components/calendar/GroupPickerModal';
import ScheduleMemoModal from '@/components/calendar/ScheduleMemoModal';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useGroup } from '@/hooks/useGroup';
import useKeyboard from '@/hooks/useKeyboard';
import { useSchedule } from '@/hooks/useSchedule';
import { createSchedule, deleteSchedulePicture, updateSchedule } from '@/services/schedule';
import { DEFAULT_SCALE_FACTOR } from '@/styles/createScaleFactor';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { IGroup } from '@/types/group';
import { Routes } from '@/types/navigation';
import { delay, parseAxiosError, showAlert, showToast } from '@/utils/factory';
import { format, isAfter, set } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Animated, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import DatePicker from 'react-native-date-picker';
import FastImage from 'react-native-fast-image';
import {
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FormData {
  title: string;
  memo: string;
  image?: { uri?: string; type?: string; name?: string };
}

const ScheduleCreateScreen = () => {
  const { navigation, params } = useAppNavigation<Routes.ScheduleCreateScreen>();
  const { palette, typography, colors } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { bottom } = useSafeAreaInsets();
  const { updateScheduleState } = useSchedule();
  const { keyboardHeight, isFocusKeyboard } = useKeyboard();
  const { group } = useGroup();

  const { handleSubmit, control, watch, setValue, setFocus, reset } = useForm<FormData>();

  const [isAllDay, setIsAllDay] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectGroup, setSelectGroup] = useState<IGroup | null>(null);
  const isImageChanged = useRef(false);

  const [isCollapsed, setIsCollapsed] = useState<'start' | 'end' | null>(null);
  const [isShowGroupPicker, setIsShowGroupPicker] = useState(false);
  const [isShowScheduleMemo, setIsShowScheduleMemo] = useState(false);

  const [allDayColorValue] = useState(new Animated.Value(0));
  const [startDateColorValue] = useState(new Animated.Value(0));
  const [endDateColorValue] = useState(new Animated.Value(0));
  const [sumbitBtnValue] = useState(new Animated.Value(0));

  useEffect(() => {
    (async () => {
      try {
        if (!params.schedule) return;

        reset({
          title: params.schedule.name,
          memo: params.schedule.description || '',
          image: params.schedule.file
            ? { uri: 'data:image/png;base64,' + params.schedule.file }
            : undefined,
        });

        setStartDate(new Date(params.schedule.startDate));
        setEndDate(new Date(params.schedule.endDate));
        setSelectGroup(group.groupByGroupId[params.schedule?.groupId]);
      } catch (err) {
        parseAxiosError(err);
      }
    })();
  }, []);

  useEffect(() => {
    (() => {
      if (params.selectDate) {
        const [year, month, day] = params.selectDate.split('-').map(Number);
        const date = set(new Date(), {
          year,
          month: month - 1,
          date: day,
        });
        setStartDate(date);
        setEndDate(date);
      }

      if (params.groupId) {
        setSelectGroup(group.groupByGroupId[params.groupId]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      Platform.OS !== 'ios' && (await delay(300));
      setFocus('title');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (isShowScheduleMemo) {
        Platform.OS !== 'ios' && (await delay(300));
        setFocus('memo');
      }
    })();
  }, [isShowScheduleMemo]);

  const onSubmit = async (data: FormData) => {
    try {
      if (!data.title) {
        return showAlert({ content: '제목을 입력해 주세요!' });
      }
      if (checkIfDateIsPast()) {
        return showAlert({ content: '시작 날짜는 종료 날짜 이전이어야 합니다!' });
      }

      const formData = new FormData();

      if (isImageChanged.current) {
        if (data.image) {
          const image: any = {
            uri: data.image.uri,
            type: data.image.type,
            name: data.image.name,
          };
          formData.append('multipartFile', image);
        } else {
          if (params.schedule) await deleteSchedulePicture(params.schedule?.scheduleId);
        }
      }

      formData.append(
        'request',
        JSON.stringify({
          name: data.title,
          description: data.memo,
          startDate,
          endDate,
          groupId: selectGroup?.groupId || null,
        }),
      );

      if (params.schedule) {
        await updateSchedule(params.schedule.scheduleId, formData);
        showToast('일정을 변경했어요!');
      } else {
        await createSchedule(formData);
        showToast('일정을 추가했어요!');
      }

      await updateScheduleState(startDate, endDate, selectGroup?.groupId);
      navigation.goBack();
    } catch (err) {
      showToast(
        params.schedule
          ? '일정 변경을 실패했습니다.\n다시 시도해주세요.'
          : '일정 생성을 실패했습니다.\n다시 시도해주세요.',
      );
      parseAxiosError(err);
    }
  };

  const checkIfDateIsPast = () => {
    const newStartDate = format(startDate, 'yyyy-MM-dd HH:mm');
    const newEndDate = format(endDate, 'yyyy-MM-dd HH:mm');
    return isAfter(newStartDate, newEndDate);
  };

  const toggleAllDay = () => {
    setIsAllDay((prev) => !prev);
    Animated.timing(allDayColorValue, {
      toValue: isAllDay ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const allDayBgColor = allDayColorValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', 'black'],
  });
  const allDayTextColor = allDayColorValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['black', 'white'],
  });
  const startDateTextColor = startDateColorValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.text, palette.grey400],
  });
  const endDateTextColor = endDateColorValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.text, palette.grey400],
  });
  const sumbitBtnBottom = sumbitBtnValue.interpolate({
    inputRange: [0, 1],
    outputRange: [bottom + 32, keyboardHeight + 24],
  });

  useEffect(() => {
    Animated.timing(sumbitBtnValue, {
      toValue: isFocusKeyboard ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocusKeyboard]);

  const openImageLibrary = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
      presentationStyle: 'pageSheet',
      assetRepresentationMode: 'current',
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset: Asset = response.assets[0];
        setValue('image', { name: asset.fileName, type: asset.type, uri: asset.uri });
        isImageChanged.current = true;
      }
    });
  };

  const handleImage = () => {
    if (watch('image')) {
      setValue('image', undefined);
      isImageChanged.current = true;
    } else {
      openImageLibrary();
    }
  };

  const toggleStartDate = () => {
    if (isCollapsed === 'start') {
      setIsCollapsed(null);
    } else {
      setIsCollapsed('start');
    }

    Animated.parallel([
      Animated.timing(startDateColorValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(endDateColorValue, {
        toValue: isCollapsed === 'start' ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const toggleEndDate = () => {
    if (isCollapsed === 'end') {
      setIsCollapsed(null);
    } else {
      setIsCollapsed('end');
    }

    Animated.parallel([
      Animated.timing(startDateColorValue, {
        toValue: isCollapsed === 'end' ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(endDateColorValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleDatePicker = (date: Date) => {
    if (isCollapsed === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const ScheduleDatePicker = () => (
    <View style={[styles.row]}>
      <Icon
        icon="MaterialCommunityIcons"
        name="clock-time-nine-outline"
        style={{ marginRight: 8 }}
      />

      <View style={[styles.row, { flex: 1 }]}>
        <TouchableOpacity onPress={toggleStartDate}>
          <Animated.Text
            style={{
              ...(isAllDay ? typography.h1 : typography.body3),
              color: startDateTextColor,
              ...(checkIfDateIsPast() && {
                textDecorationLine: 'line-through',
                textDecorationStyle: 'solid',
                textDecorationColor: 'black',
              }),
            }}
          >
            {format(startDate, 'M월 d일 (E)', { locale: ko })}
          </Animated.Text>
          {!isAllDay && (
            <Animated.Text
              style={{
                ...typography.h1,
                color: startDateTextColor,
                ...(checkIfDateIsPast() && {
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                  textDecorationColor: 'black',
                }),
              }}
            >
              {format(startDate, 'h:mm a', { locale: ko })}
            </Animated.Text>
          )}
        </TouchableOpacity>

        <Icon icon="Ionicons" name="chevron-forward" style={{ marginHorizontal: 4 }} />

        <TouchableOpacity onPress={toggleEndDate}>
          <Animated.Text
            style={{
              ...(isAllDay ? typography.h1 : typography.body3),
              color: endDateTextColor,
              ...(checkIfDateIsPast() && {
                textDecorationLine: 'line-through',
                textDecorationStyle: 'solid',
                textDecorationColor: 'black',
              }),
            }}
          >
            {format(endDate, 'M월 d일 (E)', { locale: ko })}
          </Animated.Text>
          {!isAllDay && (
            <Animated.Text
              style={{
                ...typography.h1,
                color: endDateTextColor,
                ...(checkIfDateIsPast() && {
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                  textDecorationColor: 'black',
                }),
              }}
            >
              {format(endDate, 'h:mm a', { locale: ko })}
            </Animated.Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={toggleAllDay}>
        <Animated.View
          style={{
            backgroundColor: allDayBgColor,
            ...styles.allDayWrapper,
          }}
        >
          <Animated.Text style={{ color: allDayTextColor, ...typography.body2 }}>
            하루 종일
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );

  const ScheduleGroupPicker = () => (
    <View style={[styles.row, { marginVertical: 24 }]}>
      <Icon icon="MaterialCommunityIcons" name="account-group" style={{ marginRight: 8 }} />
      <TouchableOpacity
        disabled={Boolean(params.schedule)}
        onPress={() => setIsShowGroupPicker(true)}
        style={[
          styles.groupWrapper,
          {
            ...(params.schedule && {
              backgroundColor: undefined,
            }),
          },
        ]}
      >
        <View
          style={{
            width: 10,
            height: 10,
            backgroundColor: selectGroup?.color || 'lightblue',
            borderRadius: 10,
            marginRight: 8,
          }}
        />
        {params.schedule ? (
          <Text h3>{selectGroup?.name || '그룹 없음'}</Text>
        ) : (
          <Text h3>{selectGroup?.name || '그룹을 선택해주세요.'}</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const ScheduleImage = () => (
    <View
      style={[
        styles.row,
        {
          marginTop: 24,
          marginBottom: 12,
          alignItems: watch('image') ? 'flex-start' : 'center',
        },
      ]}
    >
      <Icon icon="MaterialCommunityIcons" name="image-outline" style={{ marginRight: 8 }} />
      <TouchableOpacity onPress={handleImage} style={styles.groupWrapper}>
        {watch('image') ? (
          <>
            <FastImage
              style={{ width: 60, height: 60, borderRadius: 1000 }}
              source={{ uri: watch('image')?.uri }}
            />
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                padding: 8,
              }}
            >
              <Icon icon="MaterialIcons" name="close" size={16} />
            </View>
          </>
        ) : (
          <Text h3>{'사진 (선택)'}</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const ScheduleMemo = () => (
    <View
      style={[
        styles.row,
        {
          marginBottom: 12,
        },
      ]}
    >
      <Icon icon="MaterialCommunityIcons" name="file-document-outline" style={{ marginRight: 8 }} />
      <TouchableOpacity onPress={() => setIsShowScheduleMemo(true)} style={styles.groupWrapper}>
        <Text h3>{watch('memo') || '메모 (선택)'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="close" />}
        onPressLeft={() => navigation.goBack()}
      />

      <ScrollView keyboardDismissMode="on-drag">
        <View style={{ paddingHorizontal: 24 }}>
          {/* title */}
          <View
            style={[
              styles.row,
              {
                marginBottom: 24,
              },
            ]}
          >
            <View
              style={{
                width: 5,
                height: DEFAULT_SCALE_FACTOR(22),
                backgroundColor: selectGroup?.color || 'lightblue',
                borderRadius: 100,
              }}
            />
            <Controller
              name="title"
              control={control}
              render={({ field: { ref, onChange, onBlur, value } }) => (
                <TextInput
                  ref={ref}
                  placeholder="제목을 입력해 주세요."
                  onBlur={onBlur}
                  maxLength={16}
                  onChangeText={onChange}
                  value={value}
                  style={{
                    paddingHorizontal: 8,
                    fontSize: DEFAULT_SCALE_FACTOR(20),
                    lineHeight: undefined,
                    flex: 1,
                  }}
                />
              )}
            />
          </View>

          <ScheduleDatePicker />

          <Collapsible
            collapsed={isCollapsed === null}
            style={{
              alignItems: 'center',
            }}
          >
            <DatePicker
              date={isCollapsed === 'start' ? startDate : endDate}
              mode={isAllDay ? 'date' : 'datetime'}
              onDateChange={handleDatePicker}
            />
          </Collapsible>

          <ScheduleGroupPicker />

          <ScheduleImage />

          <ScheduleMemo />
        </View>
      </ScrollView>

      <Animated.View
        style={{
          bottom: sumbitBtnBottom,
          ...styles.submitWrapper,
        }}
      >
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Icon icon="Ionicons" name="checkmark" style={{ marginRight: 8 }} color={palette.white} />
          <Text h2 color={palette.white}>
            저장
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <GroupPickerModal
        visible={isShowGroupPicker}
        groups={group.groups}
        selectGroup={selectGroup}
        handleSelectGroup={setSelectGroup}
        onClose={() => setIsShowGroupPicker(false)}
      />
      <ScheduleMemoModal
        visible={isShowScheduleMemo}
        onClose={() => setIsShowScheduleMemo(false)}
        control={control}
      />
    </MainLayout>
  );
};

export default ScheduleCreateScreen;

const styles = StyleSheet.create({
  groupWrapper: {
    backgroundColor: '#f4f3f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  allDayWrapper: {
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitWrapper: {
    position: 'absolute',
    backgroundColor: 'black',
    borderRadius: 100,
    right: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.3,
      },
      android: {
        elevation: 13,
      },
    }),
  },
});
