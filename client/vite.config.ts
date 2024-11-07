/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveAlias(pathUrl: string) {
	return path.resolve(__dirname, pathUrl);
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@common': resolveAlias('./src/common'),
			'@components': resolveAlias('./src/components'),
			'@hooks': resolveAlias('./src/hooks'),
			'@helpers': resolveAlias('./src/helpers'),
			'@utils': resolveAlias('./src/utils'),
			'@services': resolveAlias('./src/services'),
		},
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/setupTests.ts'],
	},
});
