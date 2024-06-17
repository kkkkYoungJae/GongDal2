import { groupState } from '@/atoms/groupState';
import { IGetGroupMemberResponse, IGroup, ISearchGroupResponse } from '@/types/group';
import _ from 'lodash';
import { useRecoilState } from 'recoil';

export const useGroup = () => {
  const [group, setGroup] = useRecoilState(groupState);

  const setGroupState = (events: IGroup[]) => {
    const tmp: { [key: string]: IGroup } = {};

    events.forEach((event) => {
      tmp[event.groupId] = event;
    });

    setGroup({
      currentGroupUsers: null,
      currentGroup: null,
      groups: events,
      groupByGroupId: tmp,
    });
  };

  const updateGroupState = (event: ISearchGroupResponse) => {
    const index = group.groups.findIndex((item) => item.groupId === event.groupId);

    const copyArray = _.cloneDeep(group.groups);
    copyArray[index] = event;

    setGroup((prev) => ({
      ...prev,
      groups: copyArray,
      groupByGroupId: {
        ...group.groupByGroupId,
        [event.groupId]: event,
      },
      currentGroup: event,
    }));
  };

  const setCurrentGroupUsers = (members: IGetGroupMemberResponse) => {
    setGroup((prev) => ({
      ...prev,
      currentGroupUsers: members,
    }));
  };

  const setCurrentGroup = (_group: ISearchGroupResponse | null) => {
    setGroup((prevState) => ({
      ...prevState,
      currentGroup: _group,
      currentGroupUsers: null,
    }));
  };

  return { group, setGroupState, setCurrentGroup, setCurrentGroupUsers, updateGroupState };
};
