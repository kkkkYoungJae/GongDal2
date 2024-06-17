import Icon from '@/components/Icon';
import Text from '@/components/Text';
import Calendar from '@/components/calendar/Calendar';
import ScheduleListModal from '@/components/calendar/ScheduleListModal';
import Week from '@/components/calendar/Week';
import YearMonthPicker from '@/components/calendar/YearMonthPicker';
import MainLayout from '@/components/layouts/MainLayout';
import { Menu, Position } from '@/components/popup-menu';
import { startYear } from '@/constants/calendar';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useCalendar } from '@/hooks/useCalendar';
import { useSchedule } from '@/hooks/useSchedule';
import { DEFAULT_SCALE_FACTOR } from '@/styles/createScaleFactor';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { Routes } from '@/types/navigation';
import { ISchedule } from '@/types/schedule';
import { fDate } from '@/utils/factory';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';

const CalendarScreen = () => {
  const { defaultHeight } = useHeaderStyle();
  const { navigation } = useAppNavigation();
  const { palette } = useUIKitTheme();
  const { calendarState } = useCalendar();
  const { scheduleState } = useSchedule();

  const scheduleListModalRef = useRef<Modalize>(null);
  const popupRef = useRef<Menu>(null);
  const elementRef = useRef<View>(null);
  const rotateValue = useRef(new Animated.Value(0)).current;
  const calendarRef = useRef<any>(null);

  const [selectDay, setSelectDay] = useState<Date>();
  const [currentYear, setCurrentYear] = useState(calendarState.curYear);
  const [currentMonth, setCurrentMonth] = useState(calendarState.curMonth);

  const [showYearMonthPicker, setShowYearMonthPicker] = useState(false);

  useEffect(() => {
    (() => {
      calendarRef.current.scrollToMonth(
        (calendarState.curYear - startYear) * 12 + calendarState.curMonth,
      );
      setCurrentYear(calendarState.curYear);
      setCurrentMonth(calendarState.curMonth);
    })();
  }, [calendarState]);

  useEffect(() => {
    Animated.timing(rotateValue, {
      toValue: showYearMonthPicker ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [showYearMonthPicker]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handlePressDay = (date: Date) => {
    setSelectDay(date);

    scheduleListModalRef.current?.open();
  };

  const handleMonthChange = useCallback(async (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  }, []);

  const filterScheduleList = () =>
    (scheduleState.scheduleByDate?.[fDate(selectDay)] || []).filter(
      (v) => v !== null,
    ) as ISchedule[];

  return (
    <MainLayout style={{ backgroundColor: palette.background }}>
      <View
        style={{
          flex: 1,
          borderRadius: 16,
          margin: 16,
          backgroundColor: palette.white,
        }}
      >
        <View
          ref={elementRef}
          collapsable={false}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: defaultHeight,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              popupRef.current?.show(elementRef.current, Position.BOTTOM_LEFT);
              setShowYearMonthPicker(true);
            }}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 8 }}
          >
            <Text h1 style={{ fontSize: DEFAULT_SCALE_FACTOR(20), marginRight: 6 }}>
              {`${currentYear}년 ${currentMonth + 1}월`}
            </Text>

            <Animated.View style={{ transform: [{ rotate }] }}>
              <Icon icon="Ionicons" name="caret-down-outline" size={16} />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.ScheduleCreateScreen, {})}
            style={{ padding: 16 }}
          >
            <Icon icon="Ionicons" name="add" />
          </TouchableOpacity>
        </View>

        <Week />

        <Calendar
          ref={calendarRef}
          type="multi-period"
          handlePressDay={handlePressDay}
          handleMonthChange={handleMonthChange}
        />
      </View>

      <YearMonthPicker
        ref={popupRef}
        onClose={() => setShowYearMonthPicker(false)}
        currentYear={currentYear}
        currentMonth={currentMonth}
        setCurrentYear={setCurrentYear}
        setCurrentMonth={setCurrentMonth}
      />

      <ScheduleListModal
        ref={scheduleListModalRef}
        selectDay={selectDay}
        scheduleList={filterScheduleList()}
      />
    </MainLayout>
  );
};

export default CalendarScreen;
