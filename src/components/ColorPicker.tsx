import { GROUP_COLORS } from '@/constants/colorPallete';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';

interface Props {
  color?: string;
  onPress: (_color: string) => void;
}

const ColorPicker = forwardRef<Modalize, Props>(({ color, onPress }, ref) => {
  const { palette } = useUIKitTheme();
  const modalRef = useRef<Modalize>(null);
  const { bottom } = useSafeAreaInsets();

  useImperativeHandle(ref, () => ({
    open: () => {
      modalRef.current?.open();
    },
    close: () => {
      modalRef.current?.close();
    },
  }));

  return (
    <Modalize ref={modalRef} adjustToContentHeight withHandle={false}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: bottom, padding: 16 }}>
        {GROUP_COLORS.map((c) => (
          <TouchableOpacity key={c} style={styles.container} onPress={() => onPress(c)}>
            <View style={[{ backgroundColor: c }, styles.wrapper]}>
              {color === c && <Icon name="check" icon="FontAwesome" color={palette.white} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Modalize>
  );
});

export default ColorPicker;

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  wrapper: {
    width: 50,
    height: 50,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
