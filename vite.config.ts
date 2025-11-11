import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import type { IncomingMessage, ServerResponse } from 'http';
import { handleApiRequest } from './api/analyze.js';

function applyCors(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default defineConfig(() => ({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    react(),
    {
      name: 'vibe-check-api-middleware',
      configureServer(server) {
        server.middlewares.use('/api/analyze', (req: IncomingMessage, res: ServerResponse, next) => {
          if (req.method === 'POST') {
            applyCors(res);
            void handleApiRequest(req, res);
            return;
          }

          if (req.method === 'OPTIONS') {
            applyCors(res);
            res.writeHead(204);
            res.end();
            return;
          }

          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
}));
