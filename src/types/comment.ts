import { PagedResponse } from './page';

export interface IGetScheduleComment {
  commentId: number;
  content: string;
  userId: number;
  nickname: string;
  createDate: string;
  childrenCount: number;
  children: (IGetScheduleComment | null)[] | null;
  editable: boolean;
  deletable: boolean;
  parentId: number | null;
}

export interface ICreateScheduleCommentRequest {
  content: string;
  parentId?: number;
}

export interface ICommentState {
  comments: PagedResponse<IGetScheduleComment> | null;
  commentIds: (number | null)[];
  commentByCommentId: { [commentId: number]: IGetScheduleComment };
  replyIdsByParentId: { [parentId: number]: (number | null)[] };
}
