import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const base = '';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: base,
  build: {
    outDir: 'upload/demo',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          chartjs: ['chart.js'],
          router: ['@tanstack/react-router'],
        },
      },
    },
  },
});
