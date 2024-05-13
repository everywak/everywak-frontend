import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sass from 'sass';
import tsconfigPaths from 'vite-tsconfig-paths';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), mkcert()],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
});
