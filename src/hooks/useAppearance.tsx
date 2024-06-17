import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
import { Appearance } from 'react-native';

const DEFAULT_APPEARANCE = 'light';

const NOOP: () => void = () => void 0;

const AppearanceContext = createContext<{
  scheme: 'light' | 'dark';
  setScheme: (val: 'light' | 'dark') => void;
}>({
  scheme: DEFAULT_APPEARANCE,
  setScheme: NOOP,
});

const SchemeManager = {
  KEY: 'sonuru@scheme',
  async get() {
    return ((await AsyncStorage.getItem(SchemeManager.KEY)) ??
      Appearance.getColorScheme() ??
      DEFAULT_APPEARANCE) as 'light' | 'dark';
  },
  async set(scheme: 'light' | 'dark') {
    await AsyncStorage.setItem(SchemeManager.KEY, scheme);
  },
};

export const AppearanceProvider = ({ children }: React.PropsWithChildren) => {
  const [scheme, setScheme] = useState<'light' | 'dark'>(
    Appearance.getColorScheme() ?? DEFAULT_APPEARANCE,
  );

  useLayoutEffect(() => {
    (async () => {
      setScheme(await SchemeManager.get());
    })();
  }, []);

  return (
    <AppearanceContext.Provider
      value={{
        scheme,
        setScheme: async (value) => {
          setScheme(value);
          await SchemeManager.set(value);
        },
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
};

const useAppearance = () => {
  return useContext(AppearanceContext);
};

export const withAppearance = (Component: (props: object) => React.ReactNode) => {
  return (props: object) => (
    <AppearanceProvider>
      <Component {...props} />
    </AppearanceProvider>
  );
};

export default useAppearance;
