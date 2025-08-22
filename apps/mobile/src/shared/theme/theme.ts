// Theme configuration for JesJam Mobile App
// This file centralizes all design tokens for consistency

export const Colors = {
  // Primary Colors
  primary: '#3B82F6',
  primaryLight: '#EBF5FF',
  
  // Gray Scale
  gray: {
    900: '#1F2937',
    800: '#374151', 
    700: '#4B5563',
    600: '#6B7280',
    500: '#9CA3AF',
    400: '#D1D5DB',
    300: '#E5E7EB',
    200: '#F3F4F6',
    100: '#F9FAFB',
    50: '#FFFFFF',
  },
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Accent Colors
  streak: {
    primary: '#D97706',
    background: '#FEF3C7',
  },
  
  // Social Colors
  facebook: '#1877F2',
  
  // Semantic Colors
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    placeholder: '#9CA3AF',
    inverse: '#FFFFFF',
    link: '#3B82F6',
  },
  
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    accent: '#EBF5FF',
  },
  
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
    focus: '#3B82F6',
    error: '#EF4444',
  },
};

export const Typography = {
  // Font Families
  fontFamily: {
    primary: 'System', // Will resolve to San Francisco on iOS, Roboto on Android
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  
  // Font Weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line Heights
  lineHeight: {
    tight: 16,
    normal: 20,
    relaxed: 24,
    loose: 28,
    xl: 32,
    '2xl': 36,
  },
  
  // Predefined Text Styles
  styles: {
    h1: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 36,
      color: Colors.text.primary,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
      color: Colors.text.primary,
    },
    h3: {
      fontSize: 20,
      fontWeight: '700' as const,
      lineHeight: 28,
      color: Colors.text.primary,
    },
    h4: {
      fontSize: 18,
      fontWeight: '700' as const,
      lineHeight: 24,
      color: Colors.text.primary,
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      color: Colors.text.primary,
    },
    bodyRegular: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      color: Colors.text.secondary,
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      color: Colors.text.tertiary,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 20,
    },
    link: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 20,
      color: Colors.text.link,
    },
  },
};

export const Spacing = {
  // Base spacing unit: 4px
  xs: 4,   // 1 unit
  sm: 8,   // 2 units
  md: 12,  // 3 units
  lg: 16,  // 4 units
  xl: 20,  // 5 units
  '2xl': 24, // 6 units
  '3xl': 32, // 8 units
  '4xl': 48, // 12 units
  '5xl': 64, // 16 units
  
  // Screen margins
  screenHorizontal: 16,
  screenVertical: 16,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999, // For circular elements
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
};

export const Layout = {
  // Component heights
  button: {
    small: 40,
    medium: 48,
    large: 56,
  },
  input: {
    height: 48,
  },
  header: {
    height: 60,
  },
  bottomNav: {
    height: 80,
  },
  
  // Touch targets
  touchTarget: {
    minimum: 44,
  },
  
  // Z-index layers
  zIndex: {
    base: 0,
    content: 1,
    navigation: 10,
    modal: 100,
    alert: 1000,
  },
};

export const Animation = {
  // Duration
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
  
  // Easing
  easing: {
    easeOut: 'ease-out',
    easeIn: 'ease-in',
    easeInOut: 'ease-in-out',
  },
  
  // Scale values for press states
  pressScale: 0.95,
};

// Component-specific styles
export const Components = {
  button: {
    primary: {
      backgroundColor: Colors.primary,
      borderRadius: BorderRadius.md,
      paddingVertical: 14,
      paddingHorizontal: 20,
      minHeight: Layout.button.medium,
    },
    secondary: {
      backgroundColor: Colors.background.tertiary,
      borderColor: Colors.primary,
      borderWidth: 1,
      borderRadius: BorderRadius.md,
      paddingVertical: 14,
      paddingHorizontal: 20,
      minHeight: Layout.button.medium,
    },
    social: {
      backgroundColor: Colors.background.tertiary,
      borderColor: Colors.primary,
      borderWidth: 1,
      borderBottomWidth: 3,
      borderRadius: BorderRadius.md,
      paddingVertical: 14,
      paddingHorizontal: 20,
      minHeight: Layout.button.medium,
    },
  },
  
  input: {
    default: {
      backgroundColor: Colors.background.primary,
      borderColor: Colors.border.light,
      borderWidth: 1,
      borderRadius: BorderRadius.md,
      paddingVertical: 12,
      paddingHorizontal: 16,
      minHeight: Layout.input.height,
      fontSize: Typography.fontSize.base,
    },
    focused: {
      borderColor: Colors.border.focus,
    },
    error: {
      borderColor: Colors.border.error,
    },
  },
  
  card: {
    default: {
      backgroundColor: Colors.background.primary,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      ...Shadows.sm,
    },
  },
  
  modal: {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      backgroundColor: Colors.background.primary,
      borderRadius: BorderRadius.lg,
      padding: Spacing.xl,
      margin: Spacing.lg,
    },
  },
};

// Theme object combining all tokens
export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  layout: Layout,
  animation: Animation,
  components: Components,
};

export default Theme;
