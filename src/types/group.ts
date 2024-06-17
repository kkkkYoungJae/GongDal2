import { IAuthState } from './auth';
import { PagedResponse } from './page';

export interface IGroupState {
  groups: IGroup[];
  groupByGroupId: { [key: string]: IGroup };
  currentGroup: ISearchGroupResponse | null;
  currentGroupUsers: IGetGroupMemberResponse | null;
}

export interface IJoinGroupRequest {
  password: string;
  groupId: number;
}

export interface ICreateGroupResponse {
  key: string;
  groupId: number;
}

export interface IGroup {
  groupId: number;
  key: string;
  name: string;
  color: string;
  leaderNickname: string;
  createDate: string;
  cover?: string;
  leaderProfile?: string;
}

export interface ISearchGroupResponse extends IGroup {
  description: string;
  participants: 1;
}

export interface IGetGroupMemberResponse {
  kick: boolean;
  auth: boolean;
  users: PagedResponse<IGroupMember>;
}

export enum groupRole {
  leader = 'leader',
  subLeader = 'subLeader',
  member = 'member',
}

export interface IGroupMember extends IAuthState {
  role: groupRole;
}

export interface IGroupFeed {
  endDate: string;
  nickname: string;
  scheduleId: number;
  scheduleName: string;
  startDate: string;
  createDate: string;
}

export interface IAssignLeaderRequest {
  groupId: number;
  targetId: number;
}
