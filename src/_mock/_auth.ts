import { IGroupMember, groupRole } from '@/types/group';
import _mock from './_mock';

export const _authArray: IGroupMember[] = [...Array(18)].map((_, index) => ({
  userId: index + 1,
  nickname: _mock.name.firstName(index),
  birth: null,
  loginId: _mock.email(index),
  profile: null,
  role:
    index === 0
      ? groupRole.leader
      : [1, 2, 3].includes(index)
      ? groupRole.subLeader
      : groupRole.member,
}));
