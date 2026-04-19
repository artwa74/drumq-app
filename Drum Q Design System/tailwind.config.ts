import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-thai)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#0c0c10',
          soft: '#1a1a20',
          mute: '#5a5a66',
          dim: '#8e8e98',
        },
        brand: {
          DEFAULT: '#0a0a0a',    // black (primary)
          hot: '#e11d48',        // red accent
          light: '#fef2f3',      // very pale red wash
          deep: '#000000',
        },
        surface: {
          DEFAULT: '#ffffff',
          2: '#fafafa',
          3: '#f4f4f5',
        },
        line: { DEFAULT: '#e5e5e5', strong: '#d4d4d4' },
      },
      borderRadius: { xl2: '1.25rem', xl3: '1.5rem' },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04)',
        float: '0 4px 16px rgba(0,0,0,0.06)',
        glow: '0 4px 12px -2px rgba(225,29,72,0.2)',
      },
      backgroundImage: {
        'brand-grad': 'linear-gradient(135deg, #0a0a0a 0%, #000000 100%)',
        'brand-grad-soft': 'linear-gradient(135deg, #fef2f3 0%, #fecdd3 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
