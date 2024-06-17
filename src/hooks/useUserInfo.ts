import { authState } from '@/atoms/authState';
import { IAuthState } from '@/types/auth';
import { useRecoilState } from 'recoil';

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useRecoilState(authState);

  const setUserInfoState = (newAuthState: IAuthState) => {
    setUserInfo(newAuthState);
  };

  return { userInfo, setUserInfoState };
};
