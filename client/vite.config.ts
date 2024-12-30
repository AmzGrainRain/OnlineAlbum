import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {

    }
  },
  plugins: [vue()],
  server: {
    open: '/',
    cors: true,
    proxy: {
      // API 服务器 - dev
      // '/api': {
      //   target: 'http://localhost:8000',
      //   changeOrigin: true
      // },

      // 图片服务器 - dev
      // '/photos': {
      //   target: 'http://localhost:8000',
      //   changeOrigin: true
      // },

      // API 服务器 - prod
      '/api': {
        target: 'http://192.168.100.100:8000',
        changeOrigin: true
      },

      // 图片服务器 - prod
      '/photos': {
        target: 'http://192.168.100.100:8000',
        changeOrigin: true
      }
    }
  }
})
