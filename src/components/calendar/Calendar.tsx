import { endYear, startYear } from '@/constants/calendar';
import { FlashList } from '@shopify/flash-list';
import { addMonths, differenceInMonths } from 'date-fns';
import { findIndex } from 'lodash';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, View, useWindowDimensions } from 'react-native';
import Month from './Month';

const PAST_SCROLL_RANGE = differenceInMonths(new Date(), new Date(startYear, 0, 1));
const FUTURE_SCROLL_RANGE = differenceInMonths(new Date(endYear, 11, 31), new Date());

interface Props {
  groupId?: number;
  handleMonthChange: (year: number, month: number) => void;
  handlePressDay: (date: Date) => void;
}
const Calendar = forwardRef<any, Props>(({ groupId, handleMonthChange, handlePressDay }, ref) => {
  const { width } = useWindowDimensions();
  const calendarRef = useRef<FlashList<any>>(null);

  const [containerHeight, setContainerHeight] = useState(0);

  useImperativeHandle(ref, () => ({
    scrollToMonth: (month: number) => {
      calendarRef.current?.scrollToIndex({ index: month, animated: true });
    },
  }));

  const items: Date[] = useMemo(() => {
    const months: Date[] = [];
    for (let i = 0; i <= PAST_SCROLL_RANGE + FUTURE_SCROLL_RANGE; i++) {
      const rangeDate = addMonths(new Date(), i - PAST_SCROLL_RANGE);
      months.push(rangeDate);
    }

    return months;
  }, []);

  const initialDateIndex = useMemo(() => {
    return findIndex(items, function (item) {
      return item.toString() === new Date()?.toString();
    });
  }, [items]);

  const renderItem = useCallback(
    ({ item }: { item: Date }) => {
      return (
        <Month
          item={item}
          groupId={groupId}
          onPressDate={handlePressDay}
          containerHeight={containerHeight}
        />
      );
    },
    [containerHeight, handlePressDay],
  );

  const handleMonthChangeEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const year =
        startYear +
        (Math.floor(e.nativeEvent.contentOffset.x / (width - 32) / 12) >= 0
          ? Math.floor(e.nativeEvent.contentOffset.x / (width - 32) / 12)
          : 0);
      const month =
        Math.round((e.nativeEvent.contentOffset.x / (width - 32)) % 12) >= 0
          ? Math.round((e.nativeEvent.contentOffset.x / (width - 32)) % 12)
          : 0;

      handleMonthChange?.(year, month);
    },
    [handleMonthChange],
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      />
      <FlashList
        ref={calendarRef}
        data={items}
        pagingEnabled
        initialScrollIndex={initialDateIndex}
        scrollEventThrottle={32}
        onMomentumScrollEnd={handleMonthChangeEnd}
        renderItem={renderItem}
        keyExtractor={(item) => JSON.stringify(item)}
        estimatedItemSize={width - 32}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
});

export default Calendar;
