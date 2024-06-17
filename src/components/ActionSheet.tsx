import useUIKitTheme from '@/theme/useUIKitTheme';
import { debounce } from 'lodash';
import { ReactNode, forwardRef, useImperativeHandle, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from './Text';

export enum IActionSheetItemTypes {
  'destructive' = 'destructive',
  'cancel' = 'cancel',
}
export interface IActionSheetItem {
  icon: ReactNode;
  title: string;
  type?: IActionSheetItemTypes;
  onPress: () => void;
}

interface Props {
  items: IActionSheetItem[];
}

const ActionSheet = forwardRef<Modalize, Props>(({ items }, ref) => {
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
      <View style={{ marginBottom: bottom, padding: 16 }}>
        {items.map((item) => (
          <Pressable
            key={item.title}
            style={styles.actionButton}
            android_ripple={{ color: '#eee' }}
            onPress={debounce(item.onPress)}
          >
            {item.icon}
            <Text
              subtitle2
              style={{ marginLeft: 12 }}
              color={item.type === 'destructive' ? palette.red : undefined}
            >
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </Modalize>
  );
});

export default ActionSheet;

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
  actionButton: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
