import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import RNDatePicker from 'react-native-date-picker';

const DatePicker = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isAllDay, setIsAllDay] = useState(false);

  return (
    <View>
      <Collapsible collapsed={false} style={{ alignItems: 'center', position: 'absolute' }}>
        <RNDatePicker
          date={startDate}
          mode={isAllDay ? 'date' : 'datetime'}
          onDateChange={setStartDate}
        />
      </Collapsible>
      <Collapsible collapsed={false} style={{ alignItems: 'center', position: 'absolute' }}>
        <RNDatePicker
          date={endDate}
          mode={isAllDay ? 'date' : 'datetime'}
          onDateChange={setEndDate}
        />
      </Collapsible>
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({});
