import { StyleProp, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useHeaderStyle from '@/styles/useHeaderStyle';
import { BaseHeaderProps, HeaderElement } from '@/types/ui';

import createStyleSheet from '@/styles/createStyleSheet';
import useUIKitTheme from '@/theme/useUIKitTheme';
import Text, { TextProps } from './Text';

export type HeaderProps = BaseHeaderProps<
  {
    title?: HeaderElement;
    left?: HeaderElement;
    right?: HeaderElement;
    onPressLeft?: () => void;
    onPressRight?: () => void;
  },
  {
    clearTitleMargin?: boolean;
    clearStatusBarTopInset?: boolean;
    statusBarTopInsetAs?: 'padding' | 'margin';
    underline?: boolean;
    style?: StyleProp<ViewStyle>;
  }
>;

const AlignMapper = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;
const Header = ({
  children,
  titleAlign,
  title = null,
  left = null,
  right = null,
  onPressLeft,
  onPressRight,
  clearTitleMargin = false,
  underline = false,
  style,
}: HeaderProps) => {
  const { defaultTitleAlign, defaultHeight } = useHeaderStyle();

  const { colors } = useUIKitTheme();
  const { left: paddingLeft, right: paddingRight } = useSafeAreaInsets();

  const actualTitleAlign = titleAlign ?? defaultTitleAlign;

  if (!title && !left && !right) {
    return (
      <View
        style={[
          {
            backgroundColor: colors.ui.header.nav.none.background,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingLeft: paddingLeft + styles.container.paddingHorizontal,
          paddingRight: paddingRight + styles.container.paddingHorizontal,
          backgroundColor: colors.ui.header.nav.none.background,
          borderBottomColor: colors.ui.header.nav.none.borderBottom,
          borderBottomWidth: underline ? 1 : 0,
        },
        style,
      ]}
    >
      <View style={[styles.header, { height: defaultHeight }]}>
        <LeftSide titleAlign={actualTitleAlign} left={left} onPressLeft={onPressLeft} />
        <View
          style={[
            styles.title,
            clearTitleMargin && { marginHorizontal: 0 },
            { justifyContent: AlignMapper[actualTitleAlign] },
          ]}
        >
          {typeof title === 'string' ? <HeaderTitle>{title}</HeaderTitle> : title}
        </View>
        <RightSide titleAlign={actualTitleAlign} right={right} onPressRight={onPressRight} />
      </View>
      {children}
    </View>
  );
};

const LeftSide = ({ titleAlign, onPressLeft, left }: HeaderProps) => {
  if (titleAlign === 'center') {
    return (
      <View style={styles.left}>
        {left && <HeaderButton onPress={onPressLeft}>{left}</HeaderButton>}
      </View>
    );
  }
  if (!left) {
    return null;
  }
  return (
    <View style={styles.left}>
      <HeaderButton onPress={onPressLeft}>{left}</HeaderButton>
    </View>
  );
};

const RightSide = ({ titleAlign, onPressRight, right }: HeaderProps) => {
  if (titleAlign === 'center') {
    return (
      <View style={styles.right}>
        {right && <HeaderButton onPress={onPressRight}>{right}</HeaderButton>}
      </View>
    );
  }
  if (!right) {
    return null;
  }
  return (
    <View style={styles.right}>
      <HeaderButton onPress={onPressRight}>{right}</HeaderButton>
    </View>
  );
};

const HeaderTitle = ({ children, style, ...props }: TextProps) => {
  return (
    <Text {...props} h2 numberOfLines={1} style={style}>
      {children}
    </Text>
  );
};
const HeaderSubtitle = ({ children, style, ...props }: TextProps) => {
  const { colors } = useUIKitTheme();
  return (
    <Text color={colors.onBackground03} {...props} caption2 numberOfLines={1} style={style}>
      {children}
    </Text>
  );
};
const HeaderButton = ({
  children,
  disabled,
  onPress,
  color,
  ...props
}: TouchableOpacityProps & { color?: string }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      {...props}
      disabled={!onPress || disabled}
      onPress={(e) => onPress?.(e)}
      activeOpacity={0.7}
    >
      <Text body2 numberOfLines={1} color={color}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = createStyleSheet({
  container: {
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
  },
  title: {
    flex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    height: '100%',
    minWidth: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
  right: {
    height: '100%',
    minWidth: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    padding: 4,
    height: '100%',
    justifyContent: 'center',
  },
});

export default Object.assign(Header, {
  Button: HeaderButton,
  Title: HeaderTitle,
  Subtitle: HeaderSubtitle,
});
