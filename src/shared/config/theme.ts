// Тема и дизайн-токены для неоморфного UI
export interface Theme {
  colors: Colors;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  typography: Typography;
}

export interface Colors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  shadowDark: string;
  shadowLight: string;
  success: string;
  warning: string;
  error: string;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface BorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  round: number;
}

export interface Shadows {
  neumorphic: {
    distance: number;
    intensity: number;
    blur: number;
  };
}

export interface Typography {
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  fontWeight: {
    regular: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

// Светлая тема
export const lightTheme: Theme = {
  colors: {
    background: '#E0E5EC',
    surface: '#E0E5EC',
    primary: '#6C63FF',
    secondary: '#9D9BFF',
    text: '#2E384D',
    textSecondary: '#8B92A7',
    shadowDark: '#A3B1C6',
    shadowLight: '#FFFFFF',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 12,
    md: 20,
    lg: 30,
    xl: 40,
    round: 9999,
  },
  shadows: {
    neumorphic: {
      distance: 10,
      intensity: 0.15,
      blur: 20,
    },
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
};

// Темная тема
export const darkTheme: Theme = {
  colors: {
    background: '#2E3440',
    surface: '#3B4252',
    primary: '#88C0D0',
    secondary: '#81A1C1',
    text: '#ECEFF4',
    textSecondary: '#D8DEE9',
    shadowDark: '#1E222A',
    shadowLight: '#464C5D',
    success: '#A3BE8C',
    warning: '#EBCB8B',
    error: '#BF616A',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 12,
    md: 20,
    lg: 30,
    xl: 40,
    round: 9999,
  },
  shadows: {
    neumorphic: {
      distance: 10,
      intensity: 0.2,
      blur: 20,
    },
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
};
