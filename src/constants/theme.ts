export const COLORS = {
  // Primary
  primary: '#5B7FFF',
  primaryLight: '#8BA3FF',
  primaryDark: '#3D5FD9',

  // Backgrounds
  background: '#F8F9FC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F0F2F7',

  // Text
  text: '#1A1D26',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textOnPrimary: '#FFFFFF',

  // Chat
  chatBubbleAI: '#F0F2F7',
  chatBubbleUser: '#5B7FFF',
  chatInput: '#FFFFFF',

  // Board
  boardBackground: '#FFFFFF',
  boardBorder: '#E5E7EB',

  // Timeline
  timelineTrack: '#E5E7EB',
  timelineCurrent: '#5B7FFF',
  timelinePast: '#D1D5DB',
  timelineFuture: '#F0F2F7',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  // Core strip
  coreStripBg: '#F0F2F7',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
  title: 34,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
