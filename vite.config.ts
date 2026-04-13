import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('jspdf') || id.includes('jspdf-autotable')) {
            return 'pdf'
          }

          if (id.includes('@supabase')) {
            return 'supabase'
          }

          if (id.includes('react-router')) {
            return 'router'
          }

          if (id.includes('/react/') || id.includes('react-dom') || id.includes('scheduler')) {
            return 'react-core'
          }

          return 'vendor'
        },
      },
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
})
