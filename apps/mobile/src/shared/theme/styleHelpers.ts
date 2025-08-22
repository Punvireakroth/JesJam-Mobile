import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from './theme';

/**
 * Helper function to create consistent spacing
 */
export const createSpacing = (multiplier: number): number => {
  return Theme.spacing.xs * multiplier; // Base unit: 4px
};

/**
 * Helper function to get typography styles
 */
export const getTypographyStyle = (variant: keyof typeof Theme.typography.styles): TextStyle => {
  return Theme.typography.styles[variant];
};

/**
 * Helper function to create button styles
 */
export const createButtonStyle = (
  variant: 'primary' | 'secondary' | 'social' = 'primary',
  customStyles?: ViewStyle
): ViewStyle => {
  const baseStyle = Theme.components.button[variant];
  return StyleSheet.flatten([baseStyle, customStyles]);
};

/**
 * Helper function to create input styles
 */
export const createInputStyle = (
  state: 'default' | 'focused' | 'error' = 'default',
  customStyles?: ViewStyle
): ViewStyle => {
  const baseStyle = Theme.components.input.default;
  const stateStyle = state !== 'default' ? Theme.components.input[state] : {};
  return StyleSheet.flatten([baseStyle, stateStyle, customStyles]);
};

/**
 * Helper function to create card styles
 */
export const createCardStyle = (customStyles?: ViewStyle): ViewStyle => {
  return StyleSheet.flatten([Theme.components.card.default, customStyles]);
};

/**
 * Helper function to get color with opacity
 */
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Assuming hex colors, convert to rgba
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Common style mixins
 */
export const StyleMixins = {
  // Flexbox helpers
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  flexBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,

  flexStart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  } as ViewStyle,

  flexEnd: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  } as ViewStyle,

  // Screen layout
  screenContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background.primary,
  } as ViewStyle,

  screenPadding: {
    paddingHorizontal: Theme.spacing.screenHorizontal,
    paddingVertical: Theme.spacing.screenVertical,
  } as ViewStyle,

  // Common shadows
  cardShadow: Theme.shadows.sm,
  modalShadow: Theme.shadows.lg,

  // Common borders
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border.light,
  } as ViewStyle,

  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border.light,
  } as ViewStyle,

  // Text utilities
  textCenter: {
    textAlign: 'center',
  } as TextStyle,

  textBold: {
    fontWeight: Theme.typography.fontWeight.bold,
  } as TextStyle,

  textMedium: {
    fontWeight: Theme.typography.fontWeight.medium,
  } as TextStyle,

  // Common button states
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: Theme.animation.pressScale }],
  } as ViewStyle,

  buttonDisabled: {
    opacity: 0.5,
  } as ViewStyle,

  // Common spacing
  marginVertical: (size: keyof typeof Theme.spacing) => ({
    marginVertical: Theme.spacing[size],
  }),

  marginHorizontal: (size: keyof typeof Theme.spacing) => ({
    marginHorizontal: Theme.spacing[size],
  }),

  padding: (size: keyof typeof Theme.spacing) => ({
    padding: Theme.spacing[size],
  }),

  paddingVertical: (size: keyof typeof Theme.spacing) => ({
    paddingVertical: Theme.spacing[size],
  }),

  paddingHorizontal: (size: keyof typeof Theme.spacing) => ({
    paddingHorizontal: Theme.spacing[size],
  }),
};

/**
 * Responsive design helpers
 */
export const createResponsiveStyle = (
  baseStyle: ViewStyle | TextStyle,
  tabletStyle?: ViewStyle | TextStyle,
  desktopStyle?: ViewStyle | TextStyle
) => {
  // This would be expanded based on screen size detection
  return baseStyle;
};

/**
 * Accessibility helpers
 */
export const AccessibilityStyles = {
  focusable: {
    // Add focus ring for accessibility
    borderWidth: 2,
    borderColor: 'transparent',
  } as ViewStyle,

  focused: {
    borderColor: Theme.colors.border.focus,
    borderWidth: 2,
  } as ViewStyle,

  touchTarget: {
    minHeight: Theme.layout.touchTarget.minimum,
    minWidth: Theme.layout.touchTarget.minimum,
  } as ViewStyle,
};

/**
 * Animation helpers
 */
export const createPressAnimation = () => ({
  transform: [{ scale: Theme.animation.pressScale }],
});

export const createFadeAnimation = (opacity: number) => ({
  opacity,
});

/**
 * Platform-specific style helpers
 */
export const PlatformStyles = {
  androidElevation: (elevation: number) => ({
    elevation,
  }),

  iosShadow: (shadow: typeof Theme.shadows.sm) => ({
    shadowColor: shadow.shadowColor,
    shadowOffset: shadow.shadowOffset,
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius: shadow.shadowRadius,
  }),
};

/**
 * Create consistent styles for common components
 */
export const CommonStyles = StyleSheet.create({
  // Screen layouts
  screen: {
    ...StyleMixins.screenContainer,
    ...StyleMixins.screenPadding,
  },

  screenCentered: {
    ...StyleMixins.screenContainer,
    ...StyleMixins.flexCenter,
    ...StyleMixins.screenPadding,
  },

  // Text styles
  title: getTypographyStyle('h1'),
  subtitle: getTypographyStyle('h2'),
  body: getTypographyStyle('bodyLarge'),
  caption: getTypographyStyle('bodySmall'),

  // Button base styles
  buttonPrimary: createButtonStyle('primary'),
  buttonSecondary: createButtonStyle('secondary'),
  buttonSocial: createButtonStyle('social'),

  // Input styles
  input: createInputStyle(),
  inputError: createInputStyle('error'),

  // Card styles
  card: createCardStyle(),

  // Common layouts
  row: StyleMixins.flexBetween,
  rowStart: StyleMixins.flexStart,
  rowEnd: StyleMixins.flexEnd,
  center: StyleMixins.flexCenter,

  // Spacing utilities
  mb1: { marginBottom: Theme.spacing.xs },
  mb2: { marginBottom: Theme.spacing.sm },
  mb3: { marginBottom: Theme.spacing.md },
  mb4: { marginBottom: Theme.spacing.lg },
  mb5: { marginBottom: Theme.spacing.xl },
  mb6: { marginBottom: Theme.spacing['2xl'] },

  mt1: { marginTop: Theme.spacing.xs },
  mt2: { marginTop: Theme.spacing.sm },
  mt3: { marginTop: Theme.spacing.md },
  mt4: { marginTop: Theme.spacing.lg },
  mt5: { marginTop: Theme.spacing.xl },
  mt6: { marginTop: Theme.spacing['2xl'] },

  p1: { padding: Theme.spacing.xs },
  p2: { padding: Theme.spacing.sm },
  p3: { padding: Theme.spacing.md },
  p4: { padding: Theme.spacing.lg },
  p5: { padding: Theme.spacing.xl },
  p6: { padding: Theme.spacing['2xl'] },
});

export default {
  Theme,
  StyleMixins,
  CommonStyles,
  AccessibilityStyles,
  PlatformStyles,
  createSpacing,
  getTypographyStyle,
  createButtonStyle,
  createInputStyle,
  createCardStyle,
  getColorWithOpacity,
};
