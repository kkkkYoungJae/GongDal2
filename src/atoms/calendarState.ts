import { ICalendarState } from '@/types/calendar';
import { getMonth, getYear } from 'date-fns';
import { atom } from 'recoil';

const initialState: ICalendarState = {
  curMonth: getMonth(new Date()),
  curYear: getYear(new Date()),
};

export const calendarState = atom<ICalendarState>({
  key: 'calendarState',
  default: initialState,
});
