import React from 'react';
import { TextInput as RNTextInput, TextInputProps } from 'react-native';

import createStyleSheet from '@/styles/createStyleSheet';
import useUIKitTheme from '@/theme/useUIKitTheme';
import type { UIKitTheme } from '@/types/ui';

type Props = { variant?: keyof UIKitTheme['colors']['ui']['input'] } & TextInputProps;
const TextInput = React.forwardRef<RNTextInput, Props>(function TextInput(
  { children, style, variant = 'default', editable = true, ...props },
  ref,
) {
  const { typography, colors } = useUIKitTheme();

  const variantStyle = colors.ui.input[variant];
  const inputStyle = editable ? variantStyle.active : variantStyle.disabled;
  const underlineStyle = variant === 'underline' && {
    borderBottomWidth: 2,
    borderBottomColor: inputStyle.highlight,
  };
  const fontStyle = {
    ...typography.body3,
    lineHeight: typography.body3.fontSize ? typography.body3.fontSize * 1.2 : undefined,
  };

  return (
    <RNTextInput
      ref={ref}
      editable={editable}
      selectionColor={inputStyle.highlight}
      placeholderTextColor={inputStyle.placeholder}
      underlineColorAndroid="rgba(0,0,0,0)"
      autoCapitalize="none"
      autoCorrect={false}
      allowFontScaling={false}
      style={[fontStyle, styles.input, underlineStyle, style]}
      {...props}
    >
      {children}
    </RNTextInput>
  );
});

const styles = createStyleSheet({
  input: {
    includeFontPadding: false,
    paddingTop: 8,
    paddingBottom: 8,
  },
});

export default TextInput;
