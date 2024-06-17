import { atom, useRecoilState } from 'recoil';

const initialState: { loading: boolean } = {
  loading: false,
};

export const loadingState = atom<{ loading: boolean }>({
  key: 'loadingState',
  default: initialState,
});

export const useLoadingState = () => {
  const [loading, setLoading] = useRecoilState(loadingState);

  const setLoadingState = (newLoadingState: boolean) => {
    setLoading({ loading: newLoadingState });
  };

  return { loading: loading.loading, setLoadingState };
};
