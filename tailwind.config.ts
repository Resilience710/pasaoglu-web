import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0E2A47',
          deep: '#081A2D',
          gold: '#C8A35A',
          cream: '#F7F7F4',
          muted: '#6B7280',
          line: '#E5E7EB',
        },
        sector: {
          chem: '#1B4F8C',
          chemLight: '#2F6FB8',
          build: '#6B4E3D',
          buildLight: '#8A6A55',
          food: '#3E7C4A',
          foodLight: '#5BA068',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      maxWidth: {
        container: '1240px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        fadeUp: 'fadeUp 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}

export default config
