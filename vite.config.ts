import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      // Proxy API requests to your PHP backend during development
      '/api': {
        target: 'http://localhost/dollar-trade-tracker', // Change this to match your local PHP server URL
        changeOrigin: true,
      }
    }
  }
});