export interface IScheduleState {
  scheduleByDate: { [date: string]: (ISchedule | null)[] };
  scheduleByGroupId: IScheduleByGroupId;
}

export interface IScheduleByGroupId {
  [groupId: number]: { [date: string]: (ISchedule | null)[] };
}

export interface ISchedule {
  color: string | null;
  endDate: Date | string;
  name: string;
  scheduleId: number;
  startDate: Date | string;
  startingDay: boolean;
  endingDay: boolean;
  groupId: number | null;
}

export interface IGetAllScheduleRequest {
  start: string;
  end: string;
}

export interface IScheduleDetail {
  correctorNickname: string | null;
  description: string | null;
  endDate: string;
  file: null;
  groupId: number;
  name: string;
  scheduleId: number;
  startDate: string;
  editable: boolean;
  writeNickname: string;
}
