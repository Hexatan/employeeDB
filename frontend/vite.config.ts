import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow external connections (required for Docker)
    port: 8081,
    watch: {
      usePolling: true, // Enable polling for file changes (required for Docker on Windows)
      interval: 1000, // Poll every 1 second
    },
    hmr: {
      port: 8081, // Use the same port for HMR
    },
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
