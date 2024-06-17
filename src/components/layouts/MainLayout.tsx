import createStyleSheet from '@/styles/createStyleSheet';
import useUIKitTheme from '@/theme/useUIKitTheme';
import { isIOS } from '@/utils/factory';
import { PropsWithChildren } from 'react';
import { SafeAreaView, StyleProp, View, ViewStyle } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

type Props = {
  safeArea?: boolean;
  style?: StyleProp<ViewStyle>;
};

const MainLayout = ({ children, safeArea = true, style }: PropsWithChildren & Props) => {
  const { colors } = useUIKitTheme();

  if (safeArea) {
    if (isIOS) {
      return (
        <SafeAreaView style={[styles.view, { backgroundColor: colors.background }, style]}>
          {children}
        </SafeAreaView>
      );
    }

    return (
      <RNSafeAreaView style={[styles.view, { backgroundColor: colors.background }, style]}>
        {children}
      </RNSafeAreaView>
    );
  }

  return (
    <View style={[styles.view, { backgroundColor: colors.background }, style]}>{children}</View>
  );
};

const styles = createStyleSheet({
  view: {
    flex: 1,
  },
});

export default MainLayout;
