import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import useUIKitTheme from '@/theme/useUIKitTheme';
import { TypoName, UIKitTheme } from '@/types/ui';

type TypographyProps = Partial<Record<TypoName, boolean>>;
export type TextProps = RNTextProps &
  TypographyProps & { color?: ((colors: UIKitTheme['colors']) => string) | string };
const Text = ({ children, color, style, ...props }: TextProps) => {
  const { colors } = useUIKitTheme();
  const typoStyle = useTypographyFilter(props);
  return (
    <RNText
      style={[
        {
          color: typeof color === 'string' ? color : color?.(colors) ?? colors.text,
          includeFontPadding: false,
        },
        typoStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const useTypographyFilter = ({
  h1,
  h2,
  h3,
  subtitle1,
  subtitle2,
  subtitle3,
  body1,
  body2,
  body3,
  body4,
  caption1,
  caption2,
  caption3,
}: TypographyProps) => {
  const { typography } = useUIKitTheme();
  if (h1) {
    return typography.h1;
  }
  if (h2) {
    return typography.h2;
  }
  if (h3) {
    return typography.h3;
  }
  if (subtitle1) {
    return typography.subtitle1;
  }
  if (subtitle2) {
    return typography.subtitle2;
  }
  if (subtitle3) {
    return typography.subtitle3;
  }
  if (body1) {
    return typography.body1;
  }
  if (body2) {
    return typography.body2;
  }
  if (body3) {
    return typography.body3;
  }
  if (body4) {
    return typography.body4;
  }
  if (caption1) {
    return typography.caption1;
  }
  if (caption2) {
    return typography.caption2;
  }
  if (caption3) {
    return typography.caption3;
  }

  return {};
};

export default Text;
