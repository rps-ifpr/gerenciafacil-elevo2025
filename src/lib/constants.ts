export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const TRANSITIONS = {
  DEFAULT: 'all 0.3s ease-in-out',
  FAST: 'all 0.15s ease-in-out',
  SLOW: 'all 0.5s ease-in-out',
} as const;

export const THEME = {
  colors: {
    primary: 'rgb(var(--primary))',
    secondary: 'rgb(var(--secondary))',
    accent: 'rgb(var(--accent))',
    background: 'rgb(var(--background))',
    foreground: 'rgb(var(--foreground))',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
} as const;