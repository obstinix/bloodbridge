export const DESIGN_TOKENS = {
  colors: {
    primary: '#A4161A',
    secondary: '#660708',
    accent: '#E5383B',
    background: '#F5F3F4',
    surface: '#FFFFFF',
    surfaceRaised: '#FAFAFA',
    text: '#161A1D',
    textMuted: '#6B7280',
    textSubtle: '#9CA3AF',
    border: '#E2DCDC',
    borderStrong: '#C9C1C1',
    success: '#2D6A4F',
    successBg: '#D1FAE5',
    warning: '#F77F00',
    warningBg: '#FEF3C7',
    info: '#1D4ED8',
    critical: '#DC2626',
    dark: {
      background: '#0F172A',
      surface: '#1E293B',
      surfaceRaised: '#263548',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
      textSubtle: '#64748B',
      border: 'rgba(255,255,255,0.08)',
      borderStrong: 'rgba(255,255,255,0.14)',
      primary: '#DC2626',
      accent: '#F87171',
    }
  },
  fonts: {
    display: 'Bricolage Grotesque, sans-serif',
    heading: 'Space Grotesk, sans-serif',
    body: 'DM Sans, sans-serif',
    mono: 'JetBrains Mono, monospace'
  }
} as const;
