import { ReactNode } from 'react';
import { TextStyle } from 'react-native';

export interface UIKitTypography {
  h1: FontAttributes;
  h2: FontAttributes;
  h3: FontAttributes;
  subtitle1: FontAttributes;
  subtitle2: FontAttributes;
  subtitle3: FontAttributes;
  body1: FontAttributes;
  body2: FontAttributes;
  body3: FontAttributes;
  body4: FontAttributes;
  caption1: FontAttributes;
  caption2: FontAttributes;
  caption3: FontAttributes;
}
export type TypoName = keyof UIKitTypography;
export type FontAttributes = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'fontWeight'>;

export type UIKitColorScheme = 'light' | 'dark';
export interface UIKitTheme {
  colorScheme: UIKitColorScheme;
  select<V>(options: { [key in UIKitColorScheme | 'default']?: V }): V;

  palette: UIKitPalette;
  colors: UIKitColors;

  typography: UIKitTypography;
}

export type Component = 'Header' | 'Button' | 'Dialog' | 'Input' | 'Badge' | 'Placeholder';

export type GetColorTree<
  Tree extends {
    Variant: {
      [key in Component]: string;
    };
    State: {
      [key in Component]: string;
    };
    ColorPart: {
      [key in Component]: string;
    };
  },
> = Tree;

export type ComponentColorTree = GetColorTree<{
  Variant: {
    Header: 'nav';
    Button: 'contained' | 'text';
    Dialog: 'default';
    Input: 'default' | 'underline';
    Badge: 'default';
    Placeholder: 'default';
  };
  State: {
    Header: 'none';
    Button: 'enabled' | 'pressed' | 'disabled';
    Dialog: 'none';
    Input: 'active' | 'disabled';
    Badge: 'none';
    Placeholder: 'none';
  };
  ColorPart: {
    Header: 'background' | 'borderBottom';
    Button: 'background' | 'content';
    Dialog: 'background' | 'text' | 'message' | 'highlight' | 'destructive' | 'blurred';
    Input: 'text' | 'placeholder' | 'background' | 'highlight';
    Badge: 'text' | 'background';
    Placeholder: 'content' | 'highlight';
  };
}>;

export type ComponentColors<T extends Component> = {
  [key in ComponentColorTree['Variant'][T]]: {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    [key in ComponentColorTree['State'][T]]: {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      [key in ComponentColorTree['ColorPart'][T]]: string;
    };
  };
};

export interface UIKitColors {
  primary: string;
  secondary: string;
  error: string;
  background: string;
  text: string;
  onBackground01: string;
  onBackground02: string;
  onBackground03: string;
  onBackground04: string;
  onBackgroundReverse01: string;
  onBackgroundReverse02: string;
  onBackgroundReverse03: string;
  onBackgroundReverse04: string;
  /**
   * UI Colors has below structure
   * Component.{Variant}.{State}.{ColorPart}
   * @example
   * ```
   *  const { colors } = useUIKitTheme();
   *  colors.ui.button.contained.disabled.backgroundColor
   * ```
   * */
  ui: {
    header: ComponentColors<'Header'>;
    button: ComponentColors<'Button'>;
    dialog: ComponentColors<'Dialog'>;
    input: ComponentColors<'Input'>;
    badge: ComponentColors<'Badge'>;
    placeholder: ComponentColors<'Placeholder'>;
  };
}
export interface UIKitPalette {
  primary: string;
  primary100: string;
  primary500: string;
  primary700: string;
  red: string;
  pink: string;
  ivory: string;
  blue: string;
  blue50: string;
  blue500: string;
  green: string;
  green50: string;
  white: string;
  black: string;
  grey: string;
  grey100: string;
  grey200: string;
  grey300: string;
  grey400: string;
  grey500: string;
  grey600: string;
  grey700: string;

  background: string;
  background50: string;
  background100: string;
  background200: string;
  background300: string;
  background400: string;
  background500: string;
  background600: string;
  background700: string;

  overlay01: string;
  overlay02: string;

  transparent: 'transparent';

  onBackgroundLight01: string;
  onBackgroundLight02: string;
  onBackgroundLight03: string;
  onBackgroundLight04: string;

  onBackgroundDark01: string;
  onBackgroundDark02: string;
  onBackgroundDark03: string;
  onBackgroundDark04: string;
}

export type HeaderElement = ReactNode;
export type HeaderPartProps = {
  title?: ReactNode;
  right?: ReactNode;
  left?: ReactNode;
  onPressLeft?: (...params: any[]) => any;
  onPressRight?: (...params: any[]) => any;
};
export type BaseHeaderProps<HeaderParts extends HeaderPartProps = {}, AdditionalProps = {}> = {
  titleAlign?: 'left' | 'center' | 'right';
  children?: ReactNode;
} & HeaderParts &
  AdditionalProps;
