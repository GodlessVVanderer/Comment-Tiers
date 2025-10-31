import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// FIX: Add dirname from path and fileURLToPath from url to correctly resolve __dirname
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// FIX: Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.tsx'),
        options: resolve(__dirname, 'src/options.html'),
        popup: resolve(__dirname, 'src/index.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    minify: false,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
});
