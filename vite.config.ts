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
        input: 'index.tsx',
        output: {
          entryFileNames: 'index.js',
          assetFileNames: (assetInfo) => {
            // Force any CSS file to be named index.css so PHP can find it
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'index.css';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },
  };
});