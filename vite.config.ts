import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: 'src/test/setup.ts',
    globals: true,
    // Node 25's built-in localStorage shadows jsdom's; use the browser one.
    execArgv: ['--no-experimental-webstorage'],
  },
})
