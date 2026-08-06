import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  security: {
    checkOrigin: false
  },
  server: {
    cors: true
  },
  integrations: [react()],
  vite: {
    envPrefix: ['VITE_', 'PUBLIC_'],
    server: {
      cors: true
    }
  }
});
