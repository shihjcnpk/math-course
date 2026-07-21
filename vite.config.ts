import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync } from 'node:fs'

export default defineConfig({
  base: '/math-course/',
  plugins: [
    react(),
    {
      name: 'copy-course-usage-guide',
      closeBundle() {
        copyFileSync(
          path.resolve(__dirname, 'COURSE_USAGE_GUIDE.html'),
          path.resolve(__dirname, 'dist/course-usage-guide.html'),
        )
      },
    },
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'katex-vendor',
              test: /node_modules[\\/]katex[\\/]/,
              priority: 3,
            },
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
              priority: 2,
            },
            {
              name: 'graph-vendor',
              test: /node_modules[\\/](@dagrejs|reactflow|@xyflow)[\\/]/,
              priority: 2,
            },
          ],
        },
      },
    },
  },
})
