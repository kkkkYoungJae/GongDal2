import { endYear, startYear } from '@/constants/calendar';
import { weights } from '@/constants/fontWeight';
import { useCalendar } from '@/hooks/useCalendar';
import { debounce } from 'lodash';
import { forwardRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import WheelPicker from 'react-native-wheely';
import { Menu } from '../popup-menu';

interface Props {
  onClose: () => void;
  currentYear: number;
  currentMonth: number;
  setCurrentYear: (date: number) => void;
  setCurrentMonth: (date: number) => void;
}

const YearMonthPicker = forwardRef<Menu, Props>(
  ({ onClose, currentYear, currentMonth, setCurrentMonth, setCurrentYear }, ref) => {
    const { calendarState, setCalendarState } = useCalendar();

    const yearsArray = useMemo(() => {
      return Array.from(
        { length: endYear - startYear + 1 },
        (_, index) => startYear + index + '년',
      );
    }, [startYear, endYear]);
    const monthArray = useMemo(
      () => Array.from({ length: 12 }, (_, index) => index + 1 + '월'),
      [],
    );

    const handleChangeYear = debounce((index: number) => {
      setCurrentYear(+yearsArray[index].slice(0, -1));
      setCalendarState({
        curYear: +yearsArray[index].slice(0, -1),
        curMonth: calendarState.curMonth,
      });
    }, 300);

    const handleChangeMonth = debounce((index: number) => {
      setCurrentMonth(index);
      setCalendarState({
        curYear: calendarState.curYear,
        curMonth: index,
      });
    }, 300);

    return (
      <Menu ref={ref} onHidden={onClose}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <WheelPicker
            selectedIndex={currentYear - startYear}
            options={yearsArray}
            decelerationRate="fast"
            itemTextStyle={{
              fontWeight: 'bold',
              fontFamily: weights.bold,
            }}
            containerStyle={{ width: 100 }}
            onChange={handleChangeYear}
          />
          <WheelPicker
            selectedIndex={currentMonth}
            options={monthArray}
            decelerationRate="fast"
            itemTextStyle={{
              fontWeight: 'bold',
              fontFamily: weights.bold,
            }}
            containerStyle={{ width: 100 }}
            onChange={handleChangeMonth}
          />
        </View>
      </Menu>
    );
  },
);

export default YearMonthPicker;

const styles = StyleSheet.create({});
