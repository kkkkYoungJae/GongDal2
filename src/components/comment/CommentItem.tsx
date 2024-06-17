import Icon from '@/components/Icon';
import Text from '@/components/Text';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { IGetScheduleComment } from '@/types/comment';
import { format } from 'date-fns';
import { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
  item: IGetScheduleComment;
  isReply?: boolean;
  onPressReply?: (item: IGetScheduleComment) => void;
  onPressCommentActionSheet: (item: IGetScheduleComment) => void;
}

const CommentItem = ({ item, isReply, onPressReply, onPressCommentActionSheet }: Props) => {
  const { palette } = useUIKitTheme();

  return (
    <View style={isReply ? styles.replyWrapper : styles.commentWrapper}>
      <Text h2 style={{ marginBottom: 8 }}>
        {item.nickname}
      </Text>
      <Text
        body2
        style={{
          marginBottom: 8,
        }}
      >
        {item.content}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text body3 color={palette.grey200}>
          {format(new Date(item.createDate), 'yy-MM-dd HH:mm')}
        </Text>

        {onPressReply && (
          <TouchableOpacity
            onPress={() => onPressReply?.(item)}
            style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}
          >
            <Icon
              icon="MaterialIcons"
              name="mode-comment"
              style={{ marginRight: 4 }}
              size={12}
              color={palette.grey200}
            />
            <Text body3 color={palette.grey200}>
              {item.childrenCount > 0 ? `대댓글 ${item.childrenCount}` : '대댓글 쓰기'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={{ paddingLeft: 16 }}
          onPress={() => onPressCommentActionSheet(item)}
        >
          <Icon color={palette.grey200} name="ellipsis-horizontal" icon="Ionicons" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(CommentItem);

const styles = StyleSheet.create({
  replyWrapper: {
    paddingHorizontal: 24,
    paddingLeft: 48,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#e3e6ea',
  },
  commentWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});
