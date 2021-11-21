import preprocess from 'svelte-preprocess';
import { normalizePath } from 'vite';
import path from 'path';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	root: normalizePath(path.resolve('./')),
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors

	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			optimizeDeps: {
				include: ['just-throttle', 'dayjs']
			},
			build: {
				target: 'es2019',
				sourcemap: false,
				brotliSize: false,
				rollupOptions: {
					inlineDynamicImports: true
				}
			}
		},
		prerender: {
			enabled: false
		},
		ssr: false,
		adapter: adapter()
	}
};

export default config;
