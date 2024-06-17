import { ICommentState } from '@/types/comment';
import { atom } from 'recoil';

const initialState: ICommentState = {
  comments: null,
  commentIds: [],
  commentByCommentId: {},
  replyIdsByParentId: {},
};

export const commentState = atom<ICommentState>({
  key: 'commentState',
  default: initialState,
});
