import {
  IAssignLeaderRequest,
  ICreateGroupResponse,
  IGetGroupMemberResponse,
  IGroup,
  IGroupFeed,
  IJoinGroupRequest,
  ISearchGroupResponse,
} from '@/types/group';
import { PagedResponse } from '@/types/page';
import api from './api';

export const joinGroup = (req: IJoinGroupRequest) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.post('/v1/group/join', req);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const createGroup = (request: FormData) => {
  return new Promise<ICreateGroupResponse>(async (resolve, reject) => {
    try {
      const { data } = await api.post('/v1/group/create', request, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const exitGroup = (groupId: number) => {
  return new Promise<ICreateGroupResponse>(async (resolve, reject) => {
    try {
      const { data } = await api.post(`/v1/group/exit/${groupId}`);

      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateGroup = (groupId: number, request: FormData) => {
  return new Promise<ICreateGroupResponse>(async (resolve, reject) => {
    try {
      const { data } = await api.post(`/v1/group/leader/info/${groupId}`, request, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteGroupCover = (groupId: number) => {
  return new Promise<ICreateGroupResponse>(async (resolve, reject) => {
    try {
      const { data } = await api.delete(`/v1/group/leader/info/${groupId}`);

      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getGroupKey = (groupId: number) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const { data } = await api.get(`/v1/group/key/${groupId}`);
      resolve(data.data.key);
    } catch (error) {
      reject(error);
    }
  });
};

export const getMyGroups = () => {
  return new Promise<IGroup[]>(async (resolve, reject) => {
    try {
      const { data } = await api.get('/v1/info/group');
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getGroupFeed = (groupId: number, page = 0) => {
  return new Promise<PagedResponse<IGroupFeed>>(async (resolve, reject) => {
    try {
      const { data } = await api.get(`/v1/group/feed/${groupId}?page=${page}`);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const searchGroupInfo = (key: string) => {
  return new Promise<ISearchGroupResponse>(async (resolve, reject) => {
    try {
      const { data } = await api.post('/v1/group/info/search', { key });
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getGroupMember = (groupId: number, page = 0, nickname?: string) => {
  return new Promise<IGetGroupMemberResponse>(async (resolve, reject) => {
    try {
      const { data } = await api.post(`/v1/group/${groupId}/member/list?page=${page}&size=100`, {
        nickname,
      });
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteGroup = (groupId: number) => {
  return new Promise<ISearchGroupResponse>(async (resolve, reject) => {
    try {
      const { data } = await api.delete(`/v1/group/leader/${groupId}`);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const assignSubLeader = (req: IAssignLeaderRequest) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.post('/v1/group/leader/commission/subLeader', req);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const assignLeader = (req: IAssignLeaderRequest) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await api.post('/v1/group/leader/commission', req);
      resolve(data.data);
    } catch (error) {
      reject(error);
    }
  });
};
