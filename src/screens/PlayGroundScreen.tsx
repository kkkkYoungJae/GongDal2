import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PlayGroundScreen = () => {
  const value = useRef(10);

  const promise = () => {
    return new Promise(async (resolve, reject) => {
      try {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      } catch (error) {
        reject(error);
      }
    });
  };

  useEffect(() => {
    (async () => {
      console.log(value.current);
      await promise();
      console.log(value.current);
    })();
  }, []);

  return (
    <View>
      <Text>PlayGroundScreen</Text>
    </View>
  );
};

export default PlayGroundScreen;

const styles = StyleSheet.create({});
