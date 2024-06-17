import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const sizes = {
  width,
  height,
};

export type Sizes = keyof typeof sizes;
