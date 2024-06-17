export interface IDay {
  date: string;
  day: number;
  formatted: string;
  key: number;
  month: 'pre' | 'cur' | 'next';
}
export type IWeek = IDay[];
export type IMonth = IWeek[];
export interface ICalendarState {
  curMonth: number;
  curYear: number;
}
