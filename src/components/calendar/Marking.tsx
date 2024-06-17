import { ISchedule } from '@/types/schedule';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../Text';

interface Props {
  item: ISchedule | null;
}

const Marking = ({ item }: Props) => {
  if (!item) return <View style={styles.defaultWrapper} />;

  const { color, startingDay, endingDay, name } = item;

  if (startingDay) {
    return (
      <View
        style={{
          ...styles.startingWrapper,
          backgroundColor: color ? `${color}80` : '#add8e680',
          borderColor: color || 'lightblue',
        }}
      >
        <Text body4 numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
      </View>
    );
  }

  if (endingDay) {
    return (
      <View
        style={{
          ...styles.endingWrapper,
          backgroundColor: color ? `${color}80` : '#add8e680',
        }}
      >
        <Text body4 numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        ...styles.defaultWrapper,
        backgroundColor: color ? `${color}80` : '#add8e680',
      }}
    >
      <Text body4 numberOfLines={1} ellipsizeMode="tail">
        {name}
      </Text>
    </View>
  );
};

export default memo(Marking);

const styles = StyleSheet.create({
  startingWrapper: {
    marginLeft: 2,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderLeftWidth: 4,
    paddingHorizontal: 4,
    height: 20,
    justifyContent: 'center',
    marginBottom: 4,
  },
  endingWrapper: {
    marginRight: 2,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    height: 20,
    paddingHorizontal: 4,
    justifyContent: 'center',
    marginBottom: 4,
  },
  defaultWrapper: {
    height: 20,
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
});
