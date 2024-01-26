import dotenv from 'dotenv';

// Cargar las variables de entorno del archivo .env
dotenv.config();

// Exportar las variables de entorno para que estén disponibles en el tiempo de construcción
export default {
  VITE_PUBLIC_API_URL: process.env.VITE_PUBLIC_API_URL,
  VITE_API_TARGET: process.env.VITE_API_TARGET,
  VITE_AUTUMN_TARGET: process.env.VITE_AUTUMN_TARGET,
  VITE_JANUARY_TARGET: process.env.VITE_JANUARY_TARGET,
  VITE_WS_TARGET: process.env.VITE_WS_TARGET,
};
