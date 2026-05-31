import { Platform } from 'react-native';

/**
 * Design tokens — "Mission Control" dark theme.
 * Deep-space surfaces, a single telemetry-cyan accent, restrained state colors.
 */
export const colors = {
  // Base surfaces (deep space → glass panels)
  void: '#070B18',
  abyss: '#0A1022',
  surface: '#0E1630',
  surfaceElevated: '#131D3C',
  surfaceInput: '#0C1428',

  // Hairline borders
  border: '#1C2848',
  borderStrong: '#2A3A63',

  // Text
  text: '#E9EEFA',
  textMuted: '#97A3C4',
  textFaint: '#5C6889',

  // Telemetry accent
  accent: '#5BE1E6',
  accentDeep: '#2BB6C7',
  accentInk: '#04121A',
  accentSoft: 'rgba(91,225,230,0.10)',
  accentBorder: 'rgba(91,225,230,0.45)',

  // States
  danger: '#FF6B81',
  dangerSoft: 'rgba(255,107,129,0.12)',
  dangerBorder: 'rgba(255,107,129,0.50)',
  success: '#4FE0A3',
  successSoft: 'rgba(79,224,163,0.12)',
  warning: '#FFB454',

  // Decorative
  star: '#9FB2DA',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const fonts = {
  sans: Platform.select({ ios: 'system-ui', android: 'sans-serif', default: 'system-ui' }) as string,
  mono: Platform.select({ ios: 'ui-monospace', android: 'monospace', default: 'monospace' }) as string,
} as const;

export const fontSize = {
  micro: 11,
  small: 13,
  body: 15,
  large: 17,
  title: 27,
  display: 33,
} as const;

/** Convert a 6-digit hex color to an rgba() string with the given alpha. */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
