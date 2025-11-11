import http, { type IncomingMessage, type ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';
import { handleApiRequest } from './analyze.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

const mimeTypes: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

function sendJson(res: ServerResponse, statusCode: number, payload: unknown) {
  if (!res.headersSent) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
  }
  res.end(JSON.stringify(payload));
}

function serveStaticFile(req: IncomingMessage, res: ServerResponse) {
  const parsedUrl = url.parse(req.url ?? '/');
  const pathname = parsedUrl.pathname || '/';

  const staticFileRoot = path.resolve(__dirname, '..');
  const safePathSuffix = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const staticFilePath = path.join(staticFileRoot, safePathSuffix);

  fs.stat(staticFilePath, (statErr, stats) => {
    const serveIndex = () => {
      const indexPath = path.join(staticFileRoot, 'index.html');
      fs.readFile(indexPath, (readErr, data) => {
        if (readErr) {
          console.error('CRITICAL: Could not read index.html from path:', indexPath, readErr);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error: App entry point not found.');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    };

    if (statErr) {
      serveIndex();
      return;
    }

    if (stats.isDirectory()) {
      serveIndex();
      return;
    }

    fs.readFile(staticFilePath, (fileErr, data) => {
      if (fileErr) {
        serveIndex();
      } else {
        const ext = path.parse(staticFilePath).ext;
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(data);
      }
    });
  });
}

function applyCors(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { error: 'Bad Request' });
    return;
  }

  const pathname = url.parse(req.url).pathname;

  if (pathname === '/api/analyze') {
    applyCors(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method !== 'POST') {
      sendJson(res, 405, { error: 'Method Not Allowed' });
      return;
    }

    await handleApiRequest(req, res);
    return;
  }

  serveStaticFile(req, res);
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
