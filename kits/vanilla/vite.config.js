import { czechitasRenderVitePlugin } from '@czechitas/render/plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    hmr: false,
  },
  build: {
    modulePreload: false,
  },
  plugins: [czechitasRenderVitePlugin()],
});

