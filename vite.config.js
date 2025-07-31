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
    outDir: 'build', // ✅ Serve expects this folder
  },
  server: {
    port: 5173, // Dev mode
  },
  base: './', // ✅ Makes relative paths work in production
})
