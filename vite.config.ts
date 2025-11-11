import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import type { IncomingMessage, ServerResponse } from 'http';
import { handleApiRequest } from './api/analyze.js';

function applyCors(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// --- End of API Logic ---

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Make API_KEY available to the process
  process.env.API_KEY = env.API_KEY;

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      // The proxy is no longer needed in development, as the API is handled by middleware.
    },
    plugins: [
      react(),
      {
        name: 'vibe-check-api-middleware',
        configureServer(server) {
          server.middlewares.use('/api/analyze', (req, res, next) => {
            if (req.method === 'POST') {
              handleApiRequest(req, res);
            } else {
              // Let other requests fall through to Vite or other middlewares
              next();
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        // FIX: Replace `__dirname` with a URL-based path for ES module compatibility.
        // `__dirname` is a CommonJS variable and is not available in ES modules by default.
        '@': fileURLToPath(new URL('.', import.meta.url)),
      }
    }
  };
});
