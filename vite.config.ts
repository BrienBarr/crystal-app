import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

const { version } = JSON.parse(readFileSync('./package.json', 'utf8')) as { version: string }

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/*.png', 'icon.svg'],
      manifest: {
        name: 'Crystal Guide',
        short_name: 'Crystals',
        description: 'Metaphysical and healing properties of crystals.',
        display: 'standalone',
        start_url: './',
        scope: './',
        theme_color: '#f6f2ec',
        background_color: '#f6f2ec',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,json,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: 'index.html',
      },
    }),
  ],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
  },
  test: {
    environment: 'jsdom',
    setupFiles: 'src/test/setup.ts',
    globals: true,
    // Node 25's built-in localStorage shadows jsdom's; use the browser one.
    execArgv: ['--no-experimental-webstorage'],
  },
})
