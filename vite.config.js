import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// ── Dev-only plugin: POST /__write-json writes portfolioData.json to disk ──
const writeJsonPlugin = () => ({
  name: 'write-json',
  configureServer(server) {
    server.middlewares.use('/__write-json', (req, res) => {
      if (req.method !== 'POST') {
        res.writeHead(405).end('Method Not Allowed');
        return;
      }

      // Usage: /__write-json?file=filename.json
      const url = new URL(req.url, `http://${req.headers.host}`);
      const fileName = url.searchParams.get('file');

      // Security: only allow specific files in src/data/
      const allowedFiles = ['portfolioData.json'];
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
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: err.message }));
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
