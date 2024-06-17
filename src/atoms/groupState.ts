import { IGroupState } from '@/types/group';
import { atom } from 'recoil';

const initialState: IGroupState = {
  groups: [],
  groupByGroupId: {},
  currentGroup: null,
  currentGroupUsers: null,
};

export const groupState = atom<IGroupState>({
  key: 'groupState',
  default: initialState,
});
