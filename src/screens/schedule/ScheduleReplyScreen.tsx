import ActionSheet, { IActionSheetItem, IActionSheetItemTypes } from '@/components/ActionSheet';
import Icon from '@/components/Icon';
import NotFoundPage from '@/components/NotFoundPage';
import Text from '@/components/Text';
import CommentInputModal from '@/components/comment/CommentInputModal';
import CommentItem from '@/components/comment/CommentItem';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useUserInfo } from '@/hooks/useUserInfo';
import {
  createScheduleComment,
  deleteScheduleComment,
  getScheduleReply,
  updateScheduleComment,
} from '@/services/comment';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { IGetScheduleComment } from '@/types/comment';
import { Routes } from '@/types/navigation';
import { PagedResponse } from '@/types/page';
import { delay, isIOS, parseAxiosError, showToast } from '@/utils/factory';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActionSheetIOS, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';

const ScheduleReplyScreen = () => {
  const { palette } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { navigation, params } = useAppNavigation<Routes.ScheduleReplyScreen>();
  const [scheduleReplys, setScheduleReplys] = useState<PagedResponse<IGetScheduleComment | null>>();
  const { userInfo } = useUserInfo();

  const actionSheetRef = useRef<Modalize>(null);
  const selectComment = useRef<IGetScheduleComment | null>(null);
  const isCommentEditMode = useRef(false);
  const [isShowCommentInput, setIsShowCommentInput] = useState(false);

  const [apiCalled, setApiCalled] = useState(false);
  const [actionSheetItem, setActionSheetItem] = useState<IActionSheetItem[]>([]);

  const { scheduleId, comment } = params;

  useEffect(() => {
    (async () => {
      try {
        setScheduleReplys(await getScheduleReply(scheduleId, comment.commentId));
      } catch (err) {
        parseAxiosError(err);
      } finally {
        setApiCalled(true);
      }
    })();
  }, []);

  const handleCommentActionSheet = useCallback(() => {
    const selectItem = selectComment.current;

    const actions: any = {
      수정: async () => {
        if (!isIOS) {
          actionSheetRef.current?.close();
          await delay(500);
        }
        isCommentEditMode.current = true;
        setIsShowCommentInput(true);
      },
      삭제하기: async () => {
        if (selectItem) {
          if (!isIOS) {
            actionSheetRef.current?.close();
            await delay(500);
          }
          await deleteScheduleComment(selectItem?.commentId);

          setScheduleReplys((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              content: prev.content.map((c) =>
                c?.commentId === selectComment.current?.commentId ? null : c,
              ),
            };
          });
        }
        showToast('댓글을 삭제했어요!');
        selectComment.current = null;
      },
    };

    const options = [
      ...(selectItem?.editable ? ['수정'] : []),
      ...(selectItem?.deletable ? ['삭제하기'] : []),
      ...(selectItem?.userId !== userInfo.userId ? ['신고하기'] : []),
      '취소',
    ];

    try {
      if (isIOS) {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: options,
            cancelButtonIndex: options.length - 1,
            destructiveButtonIndex: options.findIndex((op) => op === '삭제하기'),
          },
          (buttonIndex: number) => {
            actions[options[buttonIndex]]?.();
          },
        );
      } else {
        setActionSheetItem([
          ...(selectItem?.editable
            ? [
                {
                  title: '수정',
                  icon: <Icon name="edit" icon="MaterialIcons" />,
                  onPress: () => actions['수정']?.(),
                },
              ]
            : []),
          ...(selectItem?.deletable
            ? [
                {
                  title: '삭제하기',
                  icon: <Icon name="delete" icon="AntD" color={palette.red} />,
                  type: IActionSheetItemTypes.destructive,
                  onPress: () => actions['삭제하기']?.(),
                },
              ]
            : []),
          ...(selectItem?.userId !== userInfo.userId
            ? [
                {
                  title: '신고하기',
                  icon: <Icon name="warning" icon="MaterialIcons" />,
                  onPress: () => actions['신고하기']?.(),
                },
              ]
            : []),
        ]);
        actionSheetRef.current?.open();
      }
    } catch (err) {
      parseAxiosError(err);
    }
  }, []);

  const onPressCommentActionSheet = useCallback(
    (item: IGetScheduleComment) => {
      selectComment.current = item;
      handleCommentActionSheet?.();
    },
    [handleCommentActionSheet],
  );

  if (!apiCalled) return <></>;
  if (!scheduleReplys) return <NotFoundPage />;

  const handleInfiniteQuery = async () => {
    try {
      if (!scheduleReplys?.last) {
        const replys = await getScheduleReply(
          scheduleId,
          comment.commentId,
          (scheduleReplys?.number || 0) + 1,
        );

        setScheduleReplys((prev) => {
          return { ...replys, content: [...(prev?.content || []), ...replys.content] };
        });
      }
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const handleCommentAction = async (content: string) => {
    try {
      if (selectComment.current !== null && isCommentEditMode.current) {
        const commentId = selectComment.current.commentId;

        await updateScheduleComment(commentId, content.trim());
        showToast('댓글을 변경했어요!');

        setScheduleReplys((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            content: prev.content.map((c) => {
              return c?.commentId === commentId ? { ...c, content } : c;
            }),
          };
        });
      } else {
        const addReply = await createScheduleComment(scheduleId, {
          content: content.trim(),
          parentId: comment.commentId,
        });

        setScheduleReplys((prev) => {
          if (!prev) return prev;

          return { ...prev, content: [...(prev?.content || []), addReply] };
        });

        showToast('댓글을 생성했어요!');
      }
    } catch (err) {
      parseAxiosError(err);
    } finally {
      selectComment.current = null;
    }
  };

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
      />

      <FlatList
        data={scheduleReplys?.content}
        renderItem={({ item }) => (
          <CommentItem item={item} isReply onPressCommentActionSheet={onPressCommentActionSheet} />
        )}
        keyExtractor={(item, index) => index + ''}
        onEndReachedThreshold={32}
        onEndReached={handleInfiniteQuery}
        ListHeaderComponent={
          <CommentItem item={comment} onPressCommentActionSheet={onPressCommentActionSheet} />
        }
      />
      <TouchableOpacity
        onPress={() => setIsShowCommentInput(true)}
        style={styles.commentBtnWrapper}
      >
        <Text h3>클릭해서 댓글을 남겨주세요.</Text>
      </TouchableOpacity>

      <CommentInputModal
        visible={isShowCommentInput}
        onClose={() => setIsShowCommentInput(false)}
        isCommentEditMode={isCommentEditMode}
        selectComment={selectComment}
        handleCommentAction={handleCommentAction}
      />

      <ActionSheet ref={actionSheetRef} items={actionSheetItem} />
    </MainLayout>
  );
};

export default ScheduleReplyScreen;

const styles = StyleSheet.create({
  commentBtnWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginVertical: 16,
    marginHorizontal: 24,
    backgroundColor: '#f4f3f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});
