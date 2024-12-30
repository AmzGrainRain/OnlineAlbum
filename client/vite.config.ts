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
      // 线路 1

      // '/api': {
      //   target: 'http://192.168.100.100:8000',
      //   changeOrigin: true
      // },
      // '/photos': {
      //   target: 'http://192.168.100.100:8000',
      //   changeOrigin: true
      // },

      // 线路 2

      // '/api': {
      //   target: 'http://192.168.100.101:8000',
      //   changeOrigin: true
      // },
      // '/photos': {
      //   target: 'http://192.168.100.101:8000',
      //   changeOrigin: true
      // }

      // 本地开发
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/photos': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
