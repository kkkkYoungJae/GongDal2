import Text from '@/components/Text';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { Routes } from '@/types/navigation';
import { ISchedule } from '@/types/schedule';
import { fDate } from '@/utils/factory';
import { format, isSameMinute } from 'date-fns';
import { ko } from 'date-fns/locale';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  selectDay?: Date;
  scheduleList: (ISchedule | null)[];
}

const ScheduleListModal = forwardRef<Modalize, Props>(({ selectDay, scheduleList }, ref) => {
  const { defaultHeight } = useHeaderStyle();
  const { palette } = useUIKitTheme();
  const { bottom } = useSafeAreaInsets();
  const { navigation } = useAppNavigation();

  const modalRef = useRef<Modalize>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      modalRef.current?.open();
    },
    close: () => {
      modalRef.current?.close();
    },
  }));

  const handlePressSchedule = async (schedule: ISchedule) => {
    modalRef.current?.close();

    if (!selectDay) return null;

    navigation.navigate(Routes.ScheduleDetailScreen, {
      scheduleId: schedule.scheduleId,
      selectDate: fDate(selectDay),
    });
  };

  const handlePressNewSchedule = async () => {
    modalRef.current?.close();

    navigation.navigate(Routes.ScheduleCreateScreen, {
      selectDate: fDate(selectDay),
    });
  };

  const HeaderComponent = () => {
    if (!selectDay) return null;

    return (
      <View style={{ padding: 16, paddingTop: 32 }}>
        <Text subtitle1 color={palette.primary}>{`${format(new Date(selectDay), 'M월 d일 (EEE)', {
          locale: ko,
        })}`}</Text>
      </View>
    );
  };

  const FooterComponent = () => (
    <View style={{ padding: 16, paddingBottom: bottom + 26 }}>
      <TouchableOpacity
        onPress={handlePressNewSchedule}
        style={{
          borderRadius: 8,
          borderColor: palette.primary,
          borderWidth: 1,
          alignItems: 'center',
          padding: 16,
          borderStyle: 'dashed',
        }}
      >
        <Text color={palette.primary}>
          {scheduleList.length > 0 ? '일정 등록' : '일정이 없어요. 새로 등록해 보세요!'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: ISchedule }) => {
    const isAllDay = isSameMinute(new Date(item.startDate), new Date(item.endDate));

    return (
      <TouchableOpacity
        key={item.scheduleId + ''}
        onPress={() => handlePressSchedule(item)}
        style={styles.itemContaier}
      >
        <View
          style={[
            styles.itemWrapper,
            {
              backgroundColor: item?.color || 'lightblue',
            },
          ]}
        />
        <View>
          <Text subtitle2 style={{ marginBottom: 4 }}>
            {item.name}
          </Text>
          <Text body3>
            {isAllDay
              ? format(item.startDate, 'M월 d일 a h:mm', { locale: ko })
              : `${format(item.startDate, 'M월 d일 a h:mm', { locale: ko })} ~ ${format(
                  item.endDate,
                  'M월 d일 a h:mm',
                  { locale: ko },
                )}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        adjustToContentHeight
        disableScrollIfPossible={false}
        modalTopOffset={defaultHeight}
        HeaderComponent={<HeaderComponent />}
        FooterComponent={<FooterComponent />}
        handlePosition="inside"
        flatListProps={{
          data: scheduleList,
          renderItem: renderItem,
          showsVerticalScrollIndicator: false,
          scrollEventThrottle: 16,
        }}
      />
    </Portal>
  );
});

export default ScheduleListModal;

const styles = StyleSheet.create({
  itemContaier: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    backgroundColor: '#f4f3f5',
    flexDirection: 'row',
    borderRadius: 16,
  },
  itemWrapper: {
    width: 5,
    height: '100%',
    borderRadius: 100,
    marginRight: 12,
  },
});
