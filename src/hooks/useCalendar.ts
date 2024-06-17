import { calendarState } from '@/atoms/calendarState';
import { ICalendarState } from '@/types/calendar';
import { getMonth, getYear } from 'date-fns';
import { useRecoilState } from 'recoil';

export const useCalendar = () => {
  const [calendar, setCalendar] = useRecoilState(calendarState);

  const setCalendarState = (newState: ICalendarState) => {
    setCalendar(newState);
  };

  const resetCalendarState = () => {
    setCalendar({ curMonth: getMonth(new Date()), curYear: getYear(new Date()) });
  };

  return { calendarState: calendar, setCalendarState, resetCalendarState };
};
