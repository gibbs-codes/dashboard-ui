import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        tv: resolve(__dirname, 'tv.html'),
        projector: resolve(__dirname, 'projector.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './components'),
      '@hooks': resolve(__dirname, './hooks'),
      '@services': resolve(__dirname, './services'),
      '@styles': resolve(__dirname, './styles'),
      '@config': resolve(__dirname, './config'),
    },
  },
})
