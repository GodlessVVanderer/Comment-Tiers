import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // NOTE: The '@' alias is removed to prevent path resolution issues during the build.
  // All internal application imports have been updated to use relative paths.
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: path.resolve(__dirname, 'src/background.ts'),
        content: path.resolve(__dirname, 'src/content.tsx'),
        options: path.resolve(__dirname, 'src/options.html'),
        popup: path.resolve(__dirname, 'src/index.html'),
      },
      output: {
        format: 'iife',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    minify: false,
  },
});