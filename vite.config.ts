import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  base: '/tarot-reader/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
})
