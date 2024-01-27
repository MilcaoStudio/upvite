import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

import dotenv from 'dotenv';

// Cargar las variables de entorno del archivo .env
dotenv.config();

// Exportar las variables de entorno para que estén disponibles en el tiempo de construcción
const API_TARGET = process.env.API_TARGET;
const AUTUMN_TARGET = process.env.AUTUMN_TARGET;
const JANUARY_TARGET = process.env.JANUARY_TARGET;
const WS_TARGET = process.env.WS_TARGET;

export default defineConfig({
  server: {
    host: 'local.revolt.chat',
    port: 5000,
    proxy: {
      '/api': {
        target: API_TARGET,
        headers: { 'Content-Type': 'application/json' },
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/autumn': {
        target: AUTUMN_TARGET,
        rewrite: (path) => path.replace(/^\/autumn/, ''),
      },
      '/january': {
        target: JANUARY_TARGET,
        rewrite: (path) => path.replace(/^\/january/, ''),
      },
      '/ws': {
        ws: true,
        target: WS_TARGET,
      },
    },
  },
  plugins: [sveltekit()],
});
