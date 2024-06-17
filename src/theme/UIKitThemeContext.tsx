import React from 'react';

import type { UIKitTheme } from '@/types/ui';

const UIKitThemeContext = React.createContext<UIKitTheme | null>(null);

export default UIKitThemeContext;
