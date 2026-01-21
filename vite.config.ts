import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    build: {
      outDir: 'build',
      emptyOutDir: true,
      rollupOptions: {
        input: 'index.tsx', // Changed from src/index.tsx to index.tsx as files are in root
        output: {
          entryFileNames: 'index.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'index.css') return 'index.css';
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },
  };
});