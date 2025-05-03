import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    react(),
    wasm(),           // allow importing .wasm
    topLevelAwait(),  // allow `await init()` at module top
  ],
  resolve: {
    alias: {
      // Redirect any `@iota/sdk` import to the WASM web build:
      '@iota/sdk': '@iota/sdk-wasm/web'
    }
  }
});
