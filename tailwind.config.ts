import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0E2A47',
          deep: '#081A2D',
          accent: '#3B82F6',       // ana mavi aksan
          accentLight: '#60A5FA',
          accentSoft: '#DBEAFE',
          cream: '#F8FAFC',
          muted: '#64748B',
          line: '#E2E8F0',
        },
        sector: {
          chem: '#7C3AED',          // mor (Kimya)
          chemLight: '#A78BFA',
          chemSoft: '#EDE9FE',
          build: '#525252',         // gri (Yapı)
          buildLight: '#737373',
          buildSoft: '#F5F5F5',
          food: '#16A34A',          // yeşil (Gıda)
          foodLight: '#4ADE80',
          foodSoft: '#DCFCE7',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      maxWidth: { container: '1240px' },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
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
