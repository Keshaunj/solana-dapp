// vite.config.js (example)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['buffer'],  // Add buffer here if necessary for specific use cases
  },
});


// module.exports = {
//   plugins: [require('@vitejs/plugin-react')()],
//   server: {
//     hmr: true,
//     watch: {
//       usePolling: true
//     }
//   }
// }