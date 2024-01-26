import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		host: 'local.revolt.chat',
		port: 5000,
		proxy: {
			'/api': {
				target: import.meta.env.API_TARGET,
				headers: {'Content-Type': 'application/json'},
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
			'/autumn': {
				target: import.meta.env.AUTUMN_TARGET,
				rewrite: (path) => path.replace(/^\/autumn/, ''),
			},
			'/january': {
				target: import.meta.env.JANUARY_TARGET,
				rewrite: (path) => path.replace(/^\/january/, ''),
			},
			'/ws': {
				ws: true,
				target: import.meta.env.WS_TARGET,
			}
		}
	},
	plugins: [sveltekit()]
});
