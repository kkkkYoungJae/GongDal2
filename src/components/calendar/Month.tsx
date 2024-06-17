import { useSchedule } from '@/hooks/useSchedule';
import { fDate } from '@/utils/factory';
import {
  addDays,
  endOfMonth,
  endOfWeek,
  getWeeksInMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { memo, useCallback } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import Day from './Day';

interface Props {
  item: Date;
  onPressDate?: (date: Date) => void;
  containerHeight: number;
  groupId?: number;
}

const Month = ({ item, containerHeight, onPressDate, groupId }: Props) => {
  const { width } = useWindowDimensions();
  const { scheduleState } = useSchedule();

  const renderMonth = useCallback(() => {
    const monthStart = startOfMonth(item);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];

    let days = [];
    let day = startDate;

    while (day <= endDate) {
      const weeks = getWeeksInMonth(day);
      for (let i = 0; i < 7; i++) {
        const formattedDate = fDate(day);
        const cloneDay = day;
        const cloneCurrent = item;
        days.push(
          <Day
            key={day.toString()}
            day={day}
            onPress={() => onPressDate?.(cloneDay)}
            current={cloneCurrent}
            schedules={
              groupId
                ? scheduleState.scheduleByGroupId[groupId]?.[formattedDate]
                : scheduleState.scheduleByDate?.[formattedDate]
            }
          />,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            minHeight: containerHeight / weeks,
          }}
          key={day.toString()}
        >
          {days}
        </View>,
      );
      days = [];
    }

    return <View style={{ flex: 1 }}>{rows}</View>;
  }, [item, scheduleState.scheduleByDate, containerHeight]);

  return (
    <View
      style={{
        width: width - 32,
        height: '100%',
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {renderMonth()}
      </ScrollView>
    </View>
  );
};

export default memo(Month);
