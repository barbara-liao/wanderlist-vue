import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    emptyOutDir: true,
    outDir: new URL('./server/public/', import.meta.url).pathname
  },
  root: new URL('./client/', import.meta.url).pathname,
  publicDir: new URL('./client/public/', import.meta.url).pathname
})
