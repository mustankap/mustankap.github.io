import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Disable source maps in production so F12 cannot map back to original source code
    sourcemap: false,
    // Enable minification (Vite uses esbuild by default which is highly optimized)
    minify: 'esbuild',
    // Assets folder inside dist/
    assetsDir: 'assets',
    // Ensure CSS code splitting is configured properly
    cssCodeSplit: false,
  },
  server: {
    port: 3000,
    open: true
  }
});
