import { IAuthState } from '@/types/auth';
import { atom } from 'recoil';

export const initialAuthState: IAuthState = {
  userId: 0,
  nickname: '',
  birth: null,
  loginId: '',
  notice: false,
  profile: null,
};

export const authState = atom<IAuthState>({
  key: 'authState',
  default: initialAuthState,
});
