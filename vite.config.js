import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/233leyuan/',
  server: {
    port: 5173
  }
})
