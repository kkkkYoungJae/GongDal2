import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';

import createStyleSheet from '@/styles/createStyleSheet';
import useUIKitTheme from '@/theme/useUIKitTheme';
import Text from './Text';

type Props = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  //   icon?: keyof typeof Icon.Assets;
  variant?: 'contained' | 'text';
  disabled?: boolean;
  onPress?: () => void;
  buttonColor?: string;
  contentColor?: string;
}>;
const Button = ({
  //   icon,
  variant = 'contained',
  buttonColor,
  contentColor,
  disabled,
  onPress,
  style,
  children,
}: Props) => {
  const { colors } = useUIKitTheme();

  const getStateColor = (pressed: boolean, _disabled?: boolean) => {
    const stateColors = colors.ui.button[variant];
    if (_disabled) {
      return stateColors.disabled;
    }
    if (pressed) {
      return stateColors.pressed;
    }
    return stateColors.enabled;
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => {
        const stateColor = getStateColor(pressed, disabled);
        return [{ backgroundColor: buttonColor ?? stateColor.background }, styles.container, style];
      }}
    >
      {({ pressed }) => {
        const stateColor = getStateColor(pressed, disabled);

        return (
          <>
            <Text h3 color={contentColor ?? stateColor.content} style={styles.text}>
              {children}
            </Text>
          </>
        );
      }}
    </Pressable>
  );
};

const styles = createStyleSheet({
  container: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { marginVertical: -4, marginRight: 8 },
  text: {},
});

export default Button;
