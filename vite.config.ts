import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from '@samrum/vite-plugin-web-extension';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    webExtension({
      // The manifest path is relative to the project root.
      // The plugin will automatically find and process all entry points listed within.
      manifest: 'src/manifest.json',
    }),
  ],
  build: {
    // The output directory is relative to the project root.
    outDir: 'dist',
    emptyOutDir: true,
  },
});
