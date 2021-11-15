import preprocess from 'svelte-preprocess';
import { normalizePath } from 'vite';
import path from 'path';

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
			}
		},
		prerender: {
			enabled: false
		},
		ssr: false
	}
};

export default config;
