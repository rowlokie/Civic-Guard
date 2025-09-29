import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Replace 'Civic-Guard' with your GitHub repo name if different
const isGitHubPages = process.env.DEPLOY_ENV === 'GH_PAGES';

export default defineConfig({
  base: isGitHubPages ? '/Civic-Guard/' : './', // GitHub Pages vs Vercel/local
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // '@' imports from src
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // local backend for dev
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
