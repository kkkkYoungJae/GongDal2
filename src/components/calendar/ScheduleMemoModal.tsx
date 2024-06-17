import useKeyboard from '@/hooks/useKeyboard';
import useHeaderStyle from '@/styles/useHeaderStyle';
import { isIOS } from '@/utils/factory';
import { Control, Controller } from 'react-hook-form';
import { Modal, View } from 'react-native';
import TextInput from '../TextInput';

interface FormData {
  title: string;
  memo: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  control: Control<FormData, any>;
}

const ScheduleMemoModal = ({ visible, onClose, control }: Props) => {
  const { HeaderComponent } = useHeaderStyle();
  const { keyboardHeight } = useKeyboard();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <HeaderComponent title="메모" underline right="완료" onPressRight={onClose} />

      <Controller
        name="memo"
        control={control}
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <TextInput
            ref={ref}
            placeholder="메모를 입력해 주세요."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            textAlignVertical="top"
            multiline
            style={{ flex: 1, padding: 16 }}
          />
        )}
      />
      {isIOS && <View style={{ height: keyboardHeight + 10 }} />}
    </Modal>
  );
};

export default ScheduleMemoModal;
