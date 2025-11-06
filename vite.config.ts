import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from '@samrum/vite-plugin-web-extension';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: resolve(__dirname, 'src/manifest.json'),
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  // This is optional but good practice for clean imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
