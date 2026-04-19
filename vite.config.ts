import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH ?? '/'

  return {
    base,
    optimizeDeps: {
      include: ['recharts', 'react-is'],
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Story X-Ray',
          short_name: 'StoryXRay',
          description: 'See the shape of your story. Find what comes next.',
          theme_color: '#aa3bff',
          background_color: '#16171d',
          display: 'standalone',
          scope: base,
          start_url: base,
          icons: [
            {
              src: `${base}icons/icon-192.png`,
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: `${base}icons/icon-512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
  }
})
