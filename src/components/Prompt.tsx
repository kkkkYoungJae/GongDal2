import { delay, isIOS } from '@/utils/factory';
import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  PlatformColor,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from './Text';
import TextInput from './TextInput';

interface Props {
  visible: boolean;
  title: string;
  description?: string;
  placeholder: string;
  onSumbit: (text: string) => void;
  onCancel: () => void;
}
const Prompt = ({ visible, title, description, placeholder, onCancel, onSumbit }: Props) => {
  const inputRef = useRef<RNTextInput>(null);

  const [text, setText] = useState('');

  const handleSumbit = () => {
    onSumbit(text);
    setText('');
  };

  useEffect(() => {
    (async () => {
      if (visible) {
        Platform.OS !== 'ios' && (await delay(300));
        inputRef.current?.focus();
      }
    })();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.titleWrapper}>
            <Text subtitle1 style={{ marginBottom: 8 }}>
              {title}
            </Text>
            {description && (
              <Text
                body3
                style={{
                  textAlign: isIOS ? 'center' : 'left',
                }}
              >
                {description}
              </Text>
            )}

            <TextInput
              ref={inputRef}
              placeholder={placeholder}
              value={text}
              maxLength={8}
              onChangeText={setText}
              style={styles.textInput}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={onCancel} style={styles.button}>
              <Text subtitle1 color={isIOS ? '#007AFF' : '#3ca49a'}>
                취소
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSumbit}
              style={[
                styles.button,
                {
                  borderLeftWidth: isIOS ? 1 : 0,
                },
              ]}
            >
              <Text body1 color={isIOS ? '#007AFF' : '#3ca49a'}>
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Prompt;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrapper: {
    ...Platform.select({
      ios: { padding: 16, alignItems: 'center', width: '100%' },
      android: { padding: 16, width: '100%' },
    }),
  },
  wrapper: {
    ...Platform.select({
      ios: {
        backgroundColor: PlatformColor('systemGray4'),
        width: '65%',
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: '50%',
      },
      android: {
        backgroundColor: '#fff',
        width: '80%',
        borderRadius: 4,
      },
    }),
  },
  buttonWrapper: {
    ...Platform.select({
      ios: { flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
      android: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        justifyContent: 'flex-end',
        padding: 16,
      },
    }),
  },
  button: {
    ...Platform.select({
      ios: {
        borderTopWidth: 1,
        borderColor: '#bfb8b6',
        flex: 1,
        padding: 16,
        alignItems: 'center',
      },
      android: { padding: 8 },
    }),
  },
  textInput: {
    ...Platform.select({
      ios: {
        backgroundColor: 'white',
        width: '100%',
        paddingHorizontal: 12,
        borderRadius: 12,
        marginTop: 24,
      },
      android: { borderBottomWidth: 1, borderColor: '#ccc', marginTop: 24 },
    }),
  },
});
