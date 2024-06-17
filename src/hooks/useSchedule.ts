import { scheduleState } from '@/atoms/scheduleState';
import { getAllSchedule } from '@/services/schedule';
import { ISchedule, IScheduleByGroupId } from '@/types/schedule';
import { fDate } from '@/utils/factory';
import { eachDayOfInterval, format, isAfter, isBefore } from 'date-fns';
import _ from 'lodash';
import { useRecoilState } from 'recoil';

export const useSchedule = () => {
  const [schedule, setSchedule] = useRecoilState(scheduleState);

  const setScheduleState = (events: ISchedule[]) => {
    setSchedule({
      scheduleByDate: generatePeriodsData(events, {}),
      scheduleByGroupId: groupSchedulesByGroupId(events, {}),
    });
  };

  const groupSchedulesByGroupId = (
    schedules: ISchedule[],
    periodsData: { [date: string]: (ISchedule | null)[] },
  ) => {
    const byGroupId = schedules.reduce(
      (acc: { [groupId: number]: ISchedule[] }, _schedule: ISchedule) => {
        if (_schedule.groupId !== null) {
          // 그룹 ID가 있는 경우에만 추가
          if (!acc[_schedule.groupId]) {
            acc[_schedule.groupId] = [];
          }

          acc[_schedule.groupId] = [...acc[_schedule.groupId], _schedule];
        }
        return acc;
      },
      {},
    );

    const periodsDataByGroupId: IScheduleByGroupId = {};

    for (let groupId in byGroupId) {
      if (byGroupId.hasOwnProperty(groupId)) {
        periodsDataByGroupId[groupId] = generatePeriodsData(byGroupId[groupId], periodsData);
      }
    }

    return periodsDataByGroupId;
  };

  const updateScheduleState = async (
    startDate: string | number | Date,
    endDate: string | number | Date,
    groupId?: number,
  ) => {
    const periodsData: { [date: string]: (ISchedule | null)[] } = {};
    const firstDate = getScheduleStartDate(fDate(startDate));
    const lastDate = getScheduleLastDate(fDate(endDate));

    const dates = eachDayOfInterval({ start: firstDate, end: lastDate });

    dates.forEach((date) => {
      const _fDate = fDate(date);
      periodsData[_fDate] = [];
    });

    const events = await getAllSchedule({
      start: firstDate,
      end: lastDate,
    });

    setSchedule((prev) => {
      const updatedScheduleByGroupId = groupId
        ? {
            ...prev.scheduleByGroupId,
            [groupId]: {
              ...groupSchedulesByGroupId(events, periodsData)[groupId],
            },
          }
        : prev.scheduleByGroupId;

      // 기존의 모든 상태를 복사하고, 특정 키를 업데이트
      return {
        ...prev,
        scheduleByDate: {
          ...prev.scheduleByDate,
          ...generatePeriodsData(events, periodsData),
        },
        scheduleByGroupId: updatedScheduleByGroupId,
      };
    });
  };

  // 해당 스케쥴로부터 이어진 첫번째 날짜 리턴
  const getScheduleStartDate = (startDate: string) => {
    const check: Record<string, boolean> = {};
    let firstDate = format(new Date(startDate), 'yyyy-MM-dd');

    const DFS = (date: string) => {
      schedule.scheduleByDate[date]?.forEach((event) => {
        if (event) {
          const _fDate = fDate(event?.startDate);
          if (!event.startingDay && !check[_fDate]) {
            DFS(_fDate);
          } else {
            // 훨씬 단축됨
            check[_fDate] = true;

            if (isBefore(_fDate, firstDate)) {
              firstDate = _fDate;
            }
          }
        }
      });
    };

    DFS(firstDate);

    return firstDate;
  };

  // 해당 스케쥴로부터 이어진 마지막 날짜 리턴
  const getScheduleLastDate = (endDate: string) => {
    const check: Record<string, boolean> = {};
    let lastDate = format(new Date(endDate), 'yyyy-MM-dd');

    const DFS = (date: string) => {
      schedule.scheduleByDate[date]?.forEach((event) => {
        if (event) {
          const _fDate = fDate(event?.endDate);

          if (!event.endingDay && !check[_fDate]) {
            DFS(_fDate);
          } else {
            // 훨씬 단축됨
            check[_fDate] = true;

            if (isAfter(_fDate, lastDate)) {
              lastDate = _fDate;
            }
          }
        }
      });
    };

    DFS(lastDate);

    return lastDate;
  };

  const generatePeriodsData = (
    _events: ISchedule[],
    _periodsData: { [date: string]: (ISchedule | null)[] },
  ) => {
    if (_events.length === 0) {
      return _periodsData;
    }
    const events = [..._events];
    const periodsData = _.cloneDeep(_periodsData);
    events.sort((a, b) => {
      const startA = new Date(a.startDate);
      const startB = new Date(b.startDate);
      if (startA < startB) return -1;
      if (startA > startB) return 1;

      const endA = new Date(a.endDate);
      const endB = new Date(b.endDate);
      //@ts-ignore
      return endB - endA;
    });

    events.forEach((event) => {
      const startDate = format(event.startDate, 'yyyy-MM-dd');
      const endDate = format(event.endDate, 'yyyy-MM-dd');

      // 시작 날짜가 periodsData에 없으면 생성
      if (!periodsData[startDate]) {
        periodsData[startDate] = [];
      }
      // 종료 날짜가 periodsData에 없으면 생성
      if (!periodsData[endDate]) {
        periodsData[endDate] = [];
      }

      // 시작 날짜와 종료 날짜가 동일한 경우
      if (startDate === endDate) {
        periodsData[startDate].push({
          ...event,
          startingDay: true,
          endingDay: true,
        });
      } else {
        const startLength = periodsData[startDate].length;
        const endLength = periodsData[endDate].length;

        // 시작 날짜와 종료 날짜를 비교해서 같은 높이로 맞추기
        if (startLength > endLength) {
          while (periodsData[endDate].length < startLength) {
            periodsData[endDate].push(null);
          }
        } else if (endLength > startLength) {
          while (periodsData[startDate].length < endLength) {
            periodsData[startDate].push(null);
          }
        }

        // 시작 날짜에 시작 표시
        periodsData[startDate].push({
          ...event,
          startingDay: true,
          endingDay: false,
        });
        // 종료 날짜에 끝 표시
        periodsData[endDate].push({
          ...event,
          startingDay: false,
          endingDay: true,
        });

        // 시작 날짜와 종료 날짜 사이의 날짜들에 대한 표시
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + 1);
        while (currentDate < new Date(endDate)) {
          const middleDate = format(currentDate, 'yyyy-MM-dd');
          if (!periodsData[middleDate]) {
            periodsData[middleDate] = [];
          }

          const middleLength = periodsData[middleDate].length;

          // 시작 날짜와 중간 날짜를 비교해서 같은 높이로 맞추기
          if (startLength > middleLength) {
            while (periodsData[middleDate].length < startLength) {
              periodsData[middleDate].push(null);
            }
          }

          periodsData[middleDate].push({
            ...event,
            startingDay: false,
            endingDay: false,
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });

    return periodsData;
  };

  return {
    scheduleState: schedule,
    setScheduleState,
    getScheduleStartDate,
    getScheduleLastDate,
    updateScheduleState,
  };
};
