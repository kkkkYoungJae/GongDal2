import images from '@/assets/images';
import { INotification } from '@/types/notification';
import { useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Text from '../Text';

interface Props {
  item: INotification;
  onPress: () => void;
}
const NotificationItem = ({ item, onPress }: Props) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const [bgColor] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.95,
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
    outputRange: [!item.active ? '#f1f4f7' : 'white', '#eee'],
  });

  const formatDateDifference = (dateString: string): string => {
    const inputDate = new Date(dateString);
    const now = new Date();

    const diffInMilliseconds = now.getTime() - inputDate.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInHours < 48) {
      return '1일 전';
    } else {
      // 'yyyy-mm-dd' 형식으로 날짜를 반환
      const year = inputDate.getFullYear();
      const month = String(inputDate.getMonth() + 1).padStart(2, '0');
      const day = String(inputDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  };

  const IMAGES = {
    일정: images.schedule,
    댓글: images.comment,
    대댓글: images.comment,
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleValue }],
            backgroundColor: bgColorInterpolate,
            padding: 16,
            borderRadius: 8,
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <FastImage source={IMAGES[item.type]} style={{ width: 24, height: 24 }} />
          <Text subtitle2 style={{ flex: 1, marginLeft: 8 }}>
            {item.type}
          </Text>
          <Text>{formatDateDifference(item.createDate)}</Text>
        </View>
        <Text body3 style={{ marginLeft: 32, marginTop: 12 }}>
          {item.message}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default NotificationItem;
