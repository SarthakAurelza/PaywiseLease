import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist', // ✅ Serve expects this folder
  },
  server: {
    host: '0.0.0.0',
    port: 5173, // Dev mode
    proxy: {
      '/api': {
        target: 'http://api.dhonchak.dev', // TODO: Replace with your actual API base URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  base: './', // ✅ Makes relative paths work in production
})
