import { curTextColor, otherTextColor } from '@/constants/colorPallete';
import { ISchedule } from '@/types/schedule';
import { format, isSameMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { memo, useCallback, useState } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import Text from '../Text';
import Marking from './Marking';

interface Props {
  day: Date;
  schedules?: (ISchedule | null)[];
  onPress?: () => void;
  current: Date;
}
const Day = ({ day, onPress, schedules = [], current }: Props) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const [bgColor] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.9,
        useNativeDriver: false,
      }),
      Animated.timing(bgColor, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: false,
      }),
      Animated.timing(bgColor, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const bgColorInterpolate = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', 'lightblue'],
  });

  const renderSchedule = useCallback(() => {
    const schedulesComponent: any[] = [];

    schedules.forEach((schedule, index) => {
      schedulesComponent.push(<Marking key={index.toString()} item={schedule} />);
    });

    return <View style={{ width: '100%' }}>{schedulesComponent}</View>;
  }, [schedules]);

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ flex: 1 }}
      onPress={onPress}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleValue }],
            backgroundColor: bgColorInterpolate,
            flex: 1,
            borderRadius: 8,
            alignItems: 'center',
          },
        ]}
      >
        <Text
          subtitle3
          style={{
            color: isSameMonth(day, current)
              ? curTextColor[format(day, 'EEE', { locale: ko })]
              : otherTextColor[format(day, 'EEE', { locale: ko })],
          }}
        >
          {format(day, 'd')}
        </Text>
        {renderSchedule()}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default memo(Day);
