import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sass from 'sass';
import tsconfigPaths from 'vite-tsconfig-paths';
import mkcert from 'vite-plugin-mkcert';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), mkcert(), nodePolyfills()],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
});
