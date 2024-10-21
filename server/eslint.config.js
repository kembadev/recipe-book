import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config({
	ignores: ['dist/**/*'],
	extends: [
		pluginJs.configs.recommended,
		...tseslint.configs.recommended,
		eslintPluginPrettierRecommended,
	],
	languageOptions: {
		ecmaVersion: 2020,
		globals: globals.node,
	},
	files: ['**/*.{js,cjs,mjs,ts,mts,cts}'],
	rules: {
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto',
			},
		],
	},
});
