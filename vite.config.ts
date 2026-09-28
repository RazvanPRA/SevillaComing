import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // site-ul e servit din https://razvanpra.github.io/SevillaComing/
  base: '/SevillaComing/',
  plugins: [react()],
  worker: {
    // worker-ul MapLibre 6 este un modul ES
    format: 'es',
  },
  build: {
    // maplibre-gl singur are ~1 MB minificat
    chunkSizeWarningLimit: 1200,
  },
})
