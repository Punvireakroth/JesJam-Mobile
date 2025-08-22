// Central export for all theme-related utilities
export { Theme, Colors, Typography, Spacing, BorderRadius, Shadows, Layout, Animation, Components } from './theme';
export { 
  StyleMixins, 
  CommonStyles, 
  AccessibilityStyles, 
  PlatformStyles,
  createSpacing,
  getTypographyStyle,
  createButtonStyle,
  createInputStyle,
  createCardStyle,
  getColorWithOpacity 
} from './styleHelpers';

// Re-export theme as default
export { Theme as default } from './theme';
