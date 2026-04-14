import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (id.includes('@mui/')) {
            return 'mui'
          }

          if (id.includes('/@emotion/')) {
            return 'mui'
          }

          if (id.includes('react-router')) {
            return 'router'
          }

          if (id.includes('/axios/')) {
            return 'network'
          }

          return 'vendor'
        },
      },
    },
  },
})
