import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

export default defineConfig(() => ({
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      // FIX: Replace `__dirname` with a URL-based path for ES module compatibility.
      // `__dirname` is a CommonJS variable and is not available in ES modules by default.
      '@': fileURLToPath(new URL('.', import.meta.url)),
    }
  }
}));