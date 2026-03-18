import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// ── Dev-only plugin: POST /__write-json writes JSON to disk ──
const writeJsonPlugin = () => ({
  name: 'write-json',
  configureServer(server) {
    // 1. JSON Persistence
    server.middlewares.use('/__write-json', (req, res, next) => {
      if (req.method !== 'POST') return next();

      const url = new URL(req.url, `http://${req.headers.host}`);
      const fileName = url.searchParams.get('file');
      const allowedFiles = ['portfolioData.json', 'landingData.json'];

      if (!fileName || !allowedFiles.includes(fileName)) {
        res.writeHead(400).end('Invalid or missing file parameter');
        return;
      }

      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          const filePath = path.resolve(__dirname, 'src/data', fileName);
          fs.writeFileSync(filePath, JSON.stringify(payload, null, 4), 'utf-8');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        } catch (err) {
          res.writeHead(400).end(JSON.stringify({ ok: false, error: err.message }));
        }
      });
    });

    // 2. Binary Image Upload
    server.middlewares.use('/__upload-image', (req, res, next) => {
      if (req.method !== 'POST') return next();

      const url = new URL(req.url, `http://${req.headers.host}`);
      const filename = url.searchParams.get('name') || `upload-${Date.now()}.png`;
      const projectId = url.searchParams.get('projectId') || 'gen';

      const uploadDir = path.resolve(__dirname, 'public/assets/uploads', projectId);
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => {
        try {
          const buffer = Buffer.concat(chunks);
          const cleanName = filename.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
          const uniqueName = `${Date.now()}-${cleanName}`;
          const filePath = path.resolve(uploadDir, uniqueName);
          
          fs.writeFileSync(filePath, buffer);
          
          const publicPath = `/assets/uploads/${projectId}/${uniqueName}`;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, url: publicPath }));
        } catch (err) {
          res.writeHead(500).end(JSON.stringify({ ok: false, error: err.message }));
        }
      });
    });
  },
});

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  plugins: [
    react(),
    writeJsonPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@admin': path.resolve(__dirname, './src/admin'),
      '@shared': path.resolve(__dirname, './src/shared')
    }
  }
})
