import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
        module: {
          'numbers': '#3b82f6',     // 数与式 - blue
          'equations': '#f59e0b',   // 方程与不等式 - amber
          'geometry': '#10b981',    // 图形与几何 - emerald
          'functions': '#8b5cf6',   // 坐标与函数 - purple
          'statistics': '#ec4899',  // 统计与数据 - pink
          'comprehensive': '#ef4444', // 综合 - red
          'assessment': '#6b7280',  // 测评 - gray
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      typography: {
        DEFAULT: { css: { maxWidth: 'none' } },
      },
    },
  },
  plugins: [typography],
} satisfies Config
