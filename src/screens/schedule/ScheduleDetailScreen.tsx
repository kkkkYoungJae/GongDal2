import ActionSheet, { IActionSheetItem, IActionSheetItemTypes } from '@/components/ActionSheet';
import Admob from '@/components/Admob';
import Icon from '@/components/Icon';
import NotFoundPage from '@/components/NotFoundPage';
import Text from '@/components/Text';
import CommentInputModal from '@/components/comment/CommentInputModal';
import CommentItem from '@/components/comment/CommentItem';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useComment } from '@/hooks/useComment';
import { useGroup } from '@/hooks/useGroup';
import { useSchedule } from '@/hooks/useSchedule';
import { useUserInfo } from '@/hooks/useUserInfo';
import {
  createScheduleComment,
  deleteScheduleComment,
  getScheduleComment,
  updateScheduleComment,
} from '@/services/comment';
import { deleteSchedule, getScheduleDetail } from '@/services/schedule';
import { DEFAULT_SCALE_FACTOR } from '@/styles/createScaleFactor';
import useHeaderStyle from '@/styles/useHeaderStyle';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { IGetScheduleComment } from '@/types/comment';
import { Routes } from '@/types/navigation';
import { IScheduleDetail } from '@/types/schedule';
import { delay, fDate, isIOS, parseAxiosError, showAlert, showToast } from '@/utils/factory';
import { format, isSameMinute } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import FastImage from 'react-native-fast-image';
import { Modalize } from 'react-native-modalize';

const ScheduleDetailScreen = () => {
  const { palette, typography } = useUIKitTheme();
  const { HeaderComponent } = useHeaderStyle();
  const { navigation, params } = useAppNavigation<Routes.ScheduleDetailScreen>();
  const { group } = useGroup();
  const { userInfo } = useUserInfo();
  const { updateScheduleState } = useSchedule();
  const { comment, setCommentState, addCommentState, deleteCommentState, updateCommentState } =
    useComment();

  const actionSheetRef = useRef<Modalize>(null);
  const selectComment = useRef<IGetScheduleComment | null>(null);
  const isCommentEditMode = useRef(false);
  const [isShowCommentInput, setIsShowCommentInput] = useState(false);

  const [scheduleDetail, setScheduleDetail] = useState<IScheduleDetail>();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [actionSheetItem, setActionSheetItem] = useState<IActionSheetItem[]>([]);
  const [apiCalled, setApiCalled] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { scheduleId } = params;

  useEffect(() => {
    (async () => {
      try {
        const detailRes = await getScheduleDetail(scheduleId);
        setScheduleDetail(detailRes);
        setIsAllDay(isSameMinute(new Date(detailRes.startDate), new Date(detailRes.endDate)));

        if (detailRes.groupId) {
          setCommentState(await getScheduleComment(scheduleId));
        }
      } catch (err) {
        parseAxiosError(err);
      } finally {
        setApiCalled(true);
      }
    })();
  }, []);

  const refetch = async () => {
    try {
      setIsLoading(true);

      const detailRes = await getScheduleDetail(scheduleId);
      setScheduleDetail(detailRes);
      setIsAllDay(isSameMinute(new Date(detailRes.startDate), new Date(detailRes.endDate)));

      if (detailRes.groupId) {
        setCommentState(await getScheduleComment(scheduleId));
      }
    } catch (err) {
      parseAxiosError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: number | null }) => {
      if (!item) return <></>;

      return (
        <>
          <CommentItem
            key={item.toString()}
            item={comment.commentByCommentId[item]}
            onPressReply={onPressReply}
            onPressCommentActionSheet={onPressCommentActionSheet}
          />
          {(comment.replyIdsByParentId?.[item] || []).map((id) => {
            if (!id) return <></>;

            return (
              <CommentItem
                item={comment.commentByCommentId[id]}
                key={id.toString()}
                isReply
                onPressCommentActionSheet={onPressCommentActionSheet}
              />
            );
          })}
        </>
      );
    },
    [comment.commentByCommentId, comment.replyIdsByParentId],
  );

  const handleCommentActionSheet = useCallback(() => {
    const selectItem = selectComment.current;

    const actions: any = {
      수정: async () => {
        if (!isIOS) {
          actionSheetRef.current?.close();
          await delay(300);
        }
        isCommentEditMode.current = true;
        setIsShowCommentInput(true);
      },
      삭제하기: async () => {
        if (selectItem) {
          if (!isIOS) {
            actionSheetRef.current?.close();
            await delay(300);
          }
          await deleteScheduleComment(selectItem?.commentId);

          deleteCommentState(selectItem);

          showToast('댓글을 삭제했어요!');
          selectComment.current = null;
        }
      },
      '대댓글 쓰기': async () => {
        if (!isIOS) {
          actionSheetRef.current?.close();
          await delay(300);
        }
        setIsShowCommentInput(true);
      },
    };

    const options = [
      ...(selectItem?.editable ? ['수정'] : []),
      ...(selectItem?.deletable ? ['삭제하기'] : []),
      ...(selectItem?.parentId === null ? ['대댓글 쓰기'] : []),
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
          ...(selectItem?.children !== null
            ? [
                {
                  title: '대댓글 쓰기',
                  icon: <Icon name="mode-comment" icon="MaterialIcons" />,
                  onPress: () => actions['대댓글 쓰기']?.(),
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

  const onPressReply = useCallback((item: IGetScheduleComment) => {
    if (item.childrenCount > 0) {
      navigation.navigate(Routes.ScheduleReplyScreen, {
        comment: item,
        scheduleId: scheduleId,
      });
    } else {
      selectComment.current = item;
      setIsShowCommentInput(true);
    }
  }, []);

  if (!apiCalled) return <></>;
  if (!scheduleDetail) return <NotFoundPage />;

  const handleDeleteSchedule = async () => {
    try {
      await new Promise((resolve, reject) => {
        Alert.alert(
          '',
          '이 이벤트를 삭제하시겠습니까?',
          [
            {
              text: '취소',
              style: 'cancel',
              onPress: () => reject('cancel request'),
            },
            {
              text: '이벤트 삭제',
              style: 'destructive',
              onPress: () => resolve(true),
            },
          ],
          { cancelable: true },
        );
      });

      await deleteSchedule(scheduleDetail.scheduleId);
      await updateScheduleState(
        scheduleDetail.startDate,
        scheduleDetail.endDate,
        scheduleDetail.groupId,
      );

      showAlert({ content: '일정을 삭제했어요!' });
      navigation.goBack();
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const handleScheduleActionSheet = () => {
    const actions: any = {
      수정: async () => {
        if (!isIOS) {
          actionSheetRef.current?.close();
          await delay(300);
        }

        navigation.replace(Routes.ScheduleCreateScreen, { schedule: scheduleDetail });
      },
      삭제하기: async () => {
        if (!isIOS) {
          actionSheetRef.current?.close();
          await delay(300);
        }
        handleDeleteSchedule();
      },
    };

    const options = [
      ...(scheduleDetail?.editable ? ['수정'] : []),
      ...(scheduleDetail?.editable ? ['삭제하기'] : []),
      '취소',
    ];

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
        {
          title: '수정',
          icon: <Icon name="edit" icon="MaterialIcons" />,
          onPress: async () => actions['수정']?.(),
        },
        {
          title: '삭제하기',
          icon: <Icon name="delete" icon="AntD" color={palette.red} />,
          type: IActionSheetItemTypes.destructive,
          onPress: async () => actions['삭제하기']?.(),
        },
      ]);
      actionSheetRef.current?.open();
    }
  };

  const handleMoreComment = async () => {
    try {
      if (!comment.comments?.last) {
        addCommentState(await getScheduleComment(scheduleId, (comment.comments?.number || 0) + 1));
      }
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const handleCommentAction = async (content: string) => {
    try {
      if (selectComment.current && isCommentEditMode.current) {
        const _selectComment = selectComment.current;

        await updateScheduleComment(_selectComment.commentId, content.trim());
        showToast('댓글을 변경했어요!');

        updateCommentState({ ..._selectComment, content: content.trim() });
      } else {
        const commentId = selectComment.current?.commentId;
        const addComment = await createScheduleComment(scheduleId, {
          content: content.trim(),
          ...(commentId && { parentId: commentId }),
        });

        if (comment.comments) {
          addCommentState({ ...comment.comments, content: [addComment] }, commentId);
        }

        showToast('댓글을 생성했어요!');
      }
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const ScheduleTitle = () => (
    <Text
      h1
      style={{
        fontSize: DEFAULT_SCALE_FACTOR(20),
        marginBottom: 16,
      }}
    >
      {scheduleDetail.name}
    </Text>
  );

  const ScheduleWriter = () => (
    <View style={[{ marginBottom: 32 }]}>
      <Text h3>작성자 : {scheduleDetail.writeNickname}</Text>
      {scheduleDetail.correctorNickname !== null &&
        scheduleDetail.correctorNickname !== userInfo.nickname && (
          <Text h3>마지막으로 수정한 사람 : {scheduleDetail.correctorNickname}</Text>
        )}
    </View>
  );

  const ScheduleDuration = () => (
    <View style={[styles.row, { marginBottom: 16 }]}>
      <Icon
        icon="MaterialCommunityIcons"
        name="clock-time-nine-outline"
        style={{ marginRight: 8 }}
      />

      <View style={[styles.row, { flex: 1 }]}>
        <View>
          <Text
            style={{
              ...(isAllDay ? typography.h1 : typography.body3),
            }}
          >
            {format(scheduleDetail.startDate, 'M월 d일 (E)', { locale: ko })}
          </Text>
          {!isAllDay && (
            <Text h1>{format(scheduleDetail.startDate, 'h:mm a', { locale: ko })}</Text>
          )}
        </View>

        <Icon icon="Ionicons" name="chevron-forward" style={{ marginHorizontal: 4 }} />

        <View>
          <Text
            style={{
              ...(isAllDay ? typography.h1 : typography.body3),
            }}
          >
            {format(scheduleDetail.endDate, 'M월 d일 (E)', { locale: ko })}
          </Text>
          {!isAllDay && <Text h1>{format(scheduleDetail.endDate, 'h:mm a', { locale: ko })}</Text>}
        </View>
      </View>

      {isAllDay && (
        <View
          style={{
            backgroundColor: 'black',
            borderWidth: 1,
            borderRadius: 100,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Text body2 color={palette.white}>
            하루 종일
          </Text>
        </View>
      )}
    </View>
  );

  const SchedlueGroup = () => (
    <View style={[styles.row, { marginBottom: 16 }]}>
      <Icon icon="MaterialCommunityIcons" name="account-group" style={{ marginRight: 8 }} />
      <View style={styles.itemWrapper}>
        <View
          style={{
            width: 10,
            height: 10,
            backgroundColor: group.groupByGroupId?.[scheduleDetail.groupId]?.color || 'lightblue',
            borderRadius: 10,
            marginRight: 8,
          }}
        />
        <Text h3>{group.groupByGroupId?.[scheduleDetail.groupId]?.name || '그룹 없음'}</Text>
      </View>
    </View>
  );

  const SchedlueImageButton = () => (
    <View style={[styles.row, { marginBottom: 16 }]}>
      <Icon icon="MaterialCommunityIcons" name="image-outline" style={{ marginRight: 8 }} />
      <TouchableOpacity
        onPress={() => setIsCollapsed((prev) => !prev)}
        disabled={!scheduleDetail.file}
        style={styles.itemWrapper}
      >
        {scheduleDetail.file ? (
          <Text h3>{isCollapsed ? '사진 보기' : '사진 가리기'}</Text>
        ) : (
          <Text h3>사진 없음</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const ScheduleMemo = () => (
    <View style={[styles.row, { marginBottom: 16 }]}>
      <Icon icon="MaterialCommunityIcons" name="file-document-outline" style={{ marginRight: 8 }} />
      <View style={styles.itemWrapper}>
        <Text h3>
          {scheduleDetail.description ? `메모 : ${scheduleDetail.description}` : '메모 없음'}
        </Text>
      </View>
    </View>
  );

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title={params?.selectDate || fDate(scheduleDetail.startDate)}
        {...(scheduleDetail.editable && {
          right: '편집',
          onPressRight: handleScheduleActionSheet,
        })}
      />

      <FlatList
        data={comment.commentIds}
        renderItem={renderItem}
        keyExtractor={(_, index) => index + ''}
        onEndReachedThreshold={32}
        onEndReached={handleMoreComment}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListHeaderComponent={() => (
          <View
            style={{
              paddingHorizontal: 24,
            }}
          >
            <ScheduleTitle />
            <ScheduleWriter />
            <ScheduleDuration />
            <SchedlueGroup />
            <SchedlueImageButton />

            <Collapsible collapsed={isCollapsed}>
              <View style={{ marginBottom: 16 }}>
                <FastImage
                  source={{ uri: 'data:image/png;base64,' + scheduleDetail.file }}
                  resizeMode="contain"
                  style={{ aspectRatio: 1, width: '100%' }}
                />
              </View>
            </Collapsible>

            <ScheduleMemo />

            <Admob style={{ marginVertical: 12 }} />
          </View>
        )}
      />
      {scheduleDetail.groupId && (
        <TouchableOpacity
          onPress={() => setIsShowCommentInput(true)}
          style={styles.commentBtnWrapper}
        >
          <Text h3>클릭해서 댓글을 남겨주세요.</Text>
        </TouchableOpacity>
      )}

      {scheduleDetail.groupId && (
        <CommentInputModal
          visible={isShowCommentInput}
          onClose={() => setIsShowCommentInput(false)}
          isCommentEditMode={isCommentEditMode}
          selectComment={selectComment}
          handleCommentAction={handleCommentAction}
        />
      )}

      <ActionSheet ref={actionSheetRef} items={actionSheetItem} />
    </MainLayout>
  );
};

export default ScheduleDetailScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemWrapper: {
    backgroundColor: '#f4f3f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  commentWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});
