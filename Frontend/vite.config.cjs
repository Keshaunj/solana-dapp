import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
// module.exports = {
//   plugins: [require('@vitejs/plugin-react')()],
//   server: {
//     hmr: true,
//     watch: {
//       usePolling: true
//     }
//   }
// }