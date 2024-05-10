import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	optimizeDeps: {
		include: ['svelte-carousel']
	},
	server: {
		fs: {
			// 프로젝트의 루트 경로에서 상대적인 경로를 사용합니다.
			allow: ['static/json']
		}
	}
};

export default config;
