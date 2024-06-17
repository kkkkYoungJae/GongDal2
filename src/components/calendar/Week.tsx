import { StyleSheet, View } from 'react-native';
import Text from '../Text';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const Week = () => {
  return (
    <View style={[styles.row, { paddingBottom: 8, paddingTop: 16 }]}>
      {DAYS.map((day) => (
        <View key={day} style={{ alignItems: 'center', flex: 1 }}>
          <Text subtitle2>{day}</Text>
        </View>
      ))}
    </View>
  );
};

export default Week;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
