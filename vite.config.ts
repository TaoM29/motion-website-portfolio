import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { portfolio } from './app/portfolio';

export default defineConfig({
  appType: 'mpa',
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  build: {
    outDir: 'dist',
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [react(), {
    name: 'portfolio-dev-routes',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const path = request.url?.split('?')[0].replace(/\/$/, '');
        if (portfolio.projects.some(project => path === `/projects/${project.slug}`)) request.url = '/index.html';
        next();
      });
    },
  }],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
});
