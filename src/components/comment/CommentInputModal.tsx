import useKeyboard from '@/hooks/useKeyboard';
import useHeaderStyle from '@/styles/useHeaderStyle';
import { IGetScheduleComment } from '@/types/comment';
import { delay, isIOS, parseAxiosError } from '@/utils/factory';
import { MutableRefObject, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, Platform, View } from 'react-native';
import Icon from '../Icon';
import TextInput from '../TextInput';

interface FormData {
  content: string;
}

interface Props {
  visible: boolean;
  isCommentEditMode: MutableRefObject<boolean>;
  selectComment: MutableRefObject<IGetScheduleComment | null>;
  handleCommentAction: (content: string) => void;
  onClose: () => void;
}

const CommentInputModal = ({
  selectComment,
  isCommentEditMode,
  visible,
  handleCommentAction,
  onClose,
}: Props) => {
  const { HeaderComponent } = useHeaderStyle();
  const { keyboardHeight } = useKeyboard();

  const { handleSubmit, control, setFocus, reset } = useForm<FormData>({
    defaultValues: { content: '' },
  });

  useEffect(() => {
    (async () => {
      if (visible) {
        Platform.OS !== 'ios' && (await delay(300));
        setFocus('content');
      }
    })();
  }, [visible]);

  useEffect(() => {
    if (isCommentEditMode.current) {
      reset({ content: selectComment.current?.content });
    }
  }, [isCommentEditMode.current]);

  const onClear = () => {
    onClose();
    reset({ content: '' });
    selectComment.current = null;
    isCommentEditMode.current = false;
  };

  const onSubmit = async (data: FormData) => {
    try {
      handleCommentAction(data.content);
      onClear();
    } catch (err) {
      parseAxiosError(err);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClear}
    >
      <HeaderComponent
        left={<Icon icon="Ionicons" name="close" />}
        onPressLeft={onClear}
        title={selectComment.current ? '대댓글' : '댓글쓰기'}
        underline
        right="등록"
        onPressRight={handleSubmit(onSubmit)}
      />

      <Controller
        name="content"
        control={control}
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <TextInput
            ref={ref}
            placeholder="댓글을 입력해 주세요."
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

export default CommentInputModal;
