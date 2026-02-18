import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // automatically update service worker
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'GradingEye ai',
        short_name: 'GradingEye',
        description: 'My awesome React PWA',
        theme_color: '#020b34ff',
        background_color: '#263160ff',
        display: 'standalone', // opens full screen, no browser UI
        orientation: 'portrait',
        icons: [
          {
            src: 'icon22.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon22.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon22.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
