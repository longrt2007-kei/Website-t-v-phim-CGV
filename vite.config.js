import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  server: { proxy: { '/api': { target: 'http://127.0.0.1:3001', rewrite: path => path.replace(/^\/api/, '') } } },
  build: { rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), admin: resolve(import.meta.dirname, 'admin.html') } } },
})
