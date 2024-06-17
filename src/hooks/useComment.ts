import { commentState } from '@/atoms/commentState';
import { IGetScheduleComment } from '@/types/comment';
import { PagedResponse } from '@/types/page';
import { useRecoilState } from 'recoil';

export const useComment = () => {
  const [comment, setComment] = useRecoilState(commentState);

  const setCommentState = (events: PagedResponse<IGetScheduleComment>) => {
    const commentByCommentId: { [commentId: number]: IGetScheduleComment } = {};
    const commentIds: number[] = [];
    const replyIdsByParentId: { [parentId: number]: number[] } = {};

    events.content.forEach((event) => {
      commentByCommentId[event.commentId] = event;
      commentIds.push(event.commentId);

      if (event.children) {
        const tmp: number[] = [];
        event.children?.forEach((child) => {
          if (child?.parentId) tmp.push(child.commentId);
          if (child?.commentId) commentByCommentId[child.commentId] = child;
        });
        replyIdsByParentId[event.commentId] = tmp;
      }
    });

    setComment({
      comments: events,
      commentIds,
      commentByCommentId,
      replyIdsByParentId,
    });
  };

  const addCommentState = (events: PagedResponse<IGetScheduleComment>, parentId?: number) => {
    const commentByCommentId: { [commentId: number]: IGetScheduleComment } = {};
    const commentIds: number[] = [];
    const replyIdsByParentId: { [parentId: number]: number[] } = {};

    if (parentId) {
      const tmp: number[] = [];

      events.content.forEach((event) => {
        commentByCommentId[event.commentId] = event;
        tmp.push(event.commentId);
      });
      replyIdsByParentId[parentId] = tmp;

      setComment((prev) => ({
        ...prev,
        commentByCommentId: { ...prev.commentByCommentId, ...commentByCommentId },
        replyIdsByParentId: {
          ...prev.replyIdsByParentId,
          [parentId]: [...prev.replyIdsByParentId[parentId], ...replyIdsByParentId[parentId]],
        },
      }));
    } else {
      events.content.forEach((event) => {
        commentByCommentId[event.commentId] = event;
        commentIds.push(event.commentId);

        if (event.children) {
          const tmp: number[] = [];
          event.children?.forEach((child) => {
            if (child?.parentId) tmp.push(child.commentId);
            if (child?.commentId) commentByCommentId[child.commentId] = child;
          });
          replyIdsByParentId[event.commentId] = tmp;
        }
      });
      setComment((prev) => ({
        comments: events,
        commentIds: [...prev.commentIds, ...commentIds],
        commentByCommentId: { ...prev.commentByCommentId, ...commentByCommentId },
        replyIdsByParentId: { ...prev.replyIdsByParentId, ...replyIdsByParentId },
      }));
    }
  };

  const deleteCommentState = (event: IGetScheduleComment) => {
    const parentId = event.parentId;
    if (parentId) {
      setComment((prev) => ({
        ...prev,
        replyIdsByParentId: {
          ...prev.replyIdsByParentId,
          [parentId]: prev.replyIdsByParentId[parentId].map((id) =>
            id === event.commentId ? null : id,
          ),
        },
      }));
    } else {
      setComment((prev) => ({
        ...prev,
        commentIds: prev.commentIds.map((id) => (id === event?.commentId ? null : id)),
      }));
    }
  };

  const updateCommentState = (event: IGetScheduleComment) => {
    setComment((prev) => ({
      ...prev,
      commentByCommentId: {
        ...prev.commentByCommentId,
        [event?.commentId]: event,
      },
    }));
  };

  return { comment, setCommentState, addCommentState, deleteCommentState, updateCommentState };
};
