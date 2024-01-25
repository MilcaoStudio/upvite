import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		host: 'local.revolt.chat',
		port: 5000,
		proxy: {
			'/api': {
				target: 'http://172.19.0.7:8000',
				headers: {'Content-Type': 'application/json'},
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
			'/autumn': {
				target: 'http://localhost:3000',
				rewrite: (path) => path.replace(/^\/autumn/, ''),
			},
			'/january': {
				target: 'http://localhost:7000',
				rewrite: (path) => path.replace(/^\/january/, ''),
			},
			'/ws': {
				ws: true,
				target: 'http://172.19.0.6:9000',
			}
		}
	},
	plugins: [sveltekit()]
});
