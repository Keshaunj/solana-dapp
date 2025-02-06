module.exports = {
  plugins: [require('@vitejs/plugin-react')()],
  server: {
    hmr: true,
    watch: {
      usePolling: true
    }
  }
}