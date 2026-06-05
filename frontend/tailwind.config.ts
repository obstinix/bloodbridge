import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#A4161A', dark: '#DC2626' },
        secondary: { DEFAULT: '#660708' },
        accent:    { DEFAULT: '#E5383B', dark: '#F87171' },
        surface:   { DEFAULT: '#FFFFFF', dark: '#1E293B' },
        border:    { DEFAULT: '#E2DCDC', dark: 'rgba(255,255,255,0.08)' },
        success:   { DEFAULT: '#2D6A4F', bg: '#D1FAE5' },
        warning:   { DEFAULT: '#F77F00', bg: '#FEF3C7' },
        critical:  '#DC2626',
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card:  '8px',
        input: '6px',
        badge: '4px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        lift: '0 4px 16px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
export default config
