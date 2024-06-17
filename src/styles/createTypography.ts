import { weights } from '@/constants/fontWeight';
import type { FontAttributes, UIKitTypography } from '@/types/ui';
import { DEFAULT_SCALE_FACTOR } from './createScaleFactor';

export type UIKitTypographyOverrides = Partial<UIKitTypography> & {
  shared?: Partial<FontAttributes>;
};

const createTypography = (
  overrides: UIKitTypographyOverrides = {},
  scaleFactor: (dp: number) => number = DEFAULT_SCALE_FACTOR,
): UIKitTypography => {
  return {
    h1: {
      fontWeight: 'bold',
      fontFamily: weights.bold,
      fontSize: scaleFactor(16),
      ...overrides.h1,
      ...overrides.shared,
    },
    h2: {
      fontWeight: 'bold',
      fontFamily: weights.bold,
      fontSize: scaleFactor(14),
      ...overrides.h2,
      ...overrides.shared,
    },
    h3: {
      fontWeight: 'bold',
      fontFamily: weights.bold,
      fontSize: scaleFactor(12),
      ...overrides.h3,
      ...overrides.shared,
    },
    subtitle1: {
      fontWeight: '500',
      fontFamily: weights.medium,
      fontSize: scaleFactor(16),
      ...overrides.subtitle1,
      ...overrides.shared,
    },
    subtitle2: {
      fontWeight: '500',
      fontFamily: weights.regular,
      fontSize: scaleFactor(14),
      ...overrides.subtitle2,
      ...overrides.shared,
    },
    subtitle3: {
      fontWeight: '500',
      fontFamily: weights.regular,
      fontSize: scaleFactor(12),
      ...overrides.subtitle3,
      ...overrides.shared,
    },
    body1: {
      fontWeight: 'normal',
      fontFamily: weights.regular,
      fontSize: scaleFactor(16),
      ...overrides.body1,
      ...overrides.shared,
    },
    body2: {
      fontWeight: 'normal',
      fontFamily: weights.regular,
      fontSize: scaleFactor(14),
      ...overrides.body2,
      ...overrides.shared,
    },
    body3: {
      fontWeight: 'normal',
      fontFamily: weights.regular,
      fontSize: scaleFactor(12),
      ...overrides.body3,
      ...overrides.shared,
    },
    body4: {
      fontWeight: 'normal',
      fontFamily: weights.regular,
      fontSize: scaleFactor(10),
      ...overrides.body3,
      ...overrides.shared,
    },
    caption1: {
      fontWeight: '300',
      fontFamily: weights.light,
      fontSize: scaleFactor(16),
      ...overrides.caption1,
      ...overrides.shared,
    },
    caption2: {
      fontWeight: '300',
      fontFamily: weights.light,
      fontSize: scaleFactor(14),
      ...overrides.caption2,
      ...overrides.shared,
    },
    caption3: {
      fontWeight: '300',
      fontFamily: weights.light,
      fontSize: scaleFactor(12),
      ...overrides.caption3,
      ...overrides.shared,
    },
  };
};

export default createTypography;
