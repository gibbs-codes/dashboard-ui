import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const directoryRedirectPlugin = (paths) => ({
  name: 'directory-redirect',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const requestPath = req.url?.split('?')[0] || ''
      const match = paths.find((p) => requestPath === `/${p}`)

      if (match) {
        res.statusCode = 301
        res.setHeader('Location', `/${match}/`)
        res.end()
        return
      }

      next()
    })
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    directoryRedirectPlugin(['projector', 'tv']),
  ],
  build: {
    rollupOptions: {
      input: {
        tv: resolve(__dirname, 'tv/index.html'),
        projector: resolve(__dirname, 'projector/index.html'),
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
