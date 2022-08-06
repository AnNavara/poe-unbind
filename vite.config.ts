import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path';

const root = resolve(__dirname, '');
const outDir = resolve(__dirname, 'app/web');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: './',
  build: {
    
    outDir: outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'app.html'),
        about: resolve(root, 'index.html')
      },
    }
  }
})
