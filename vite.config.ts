import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import envSetup from './vite-env-setup'; // Ruta al archivo que configuraste en el paso 2

export default defineConfig({
  server: {
    host: 'local.revolt.chat',
    port: 5000,
    proxy: {
      '/api': {
        target: envSetup.VITE_API_TARGET,
        headers: { 'Content-Type': 'application/json' },
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/autumn': {
        target: envSetup.VITE_AUTUMN_TARGET,
        rewrite: (path) => path.replace(/^\/autumn/, ''),
      },
      '/january': {
        target: envSetup.VITE_JANUARY_TARGET,
        rewrite: (path) => path.replace(/^\/january/, ''),
      },
      '/ws': {
        ws: true,
        target: envSetup.VITE_WS_TARGET,
      },
    },
  },
  plugins: [sveltekit()],
});
