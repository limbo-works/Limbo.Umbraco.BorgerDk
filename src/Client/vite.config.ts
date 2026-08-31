import { defineConfig } from 'vite';

export default defineConfig({
	base: '/App_Plugins/Limbo.Umbraco.BorgerDk/',
	build: {
		lib: {
			entry: 'src/index.ts',
			formats: ['es'],
			fileName: 'limbo-borgerdk',
		},
		outDir: '../Limbo.Umbraco.BorgerDk/wwwroot',
		emptyOutDir: true,
		sourcemap: true,
		rollupOptions: {
			external: [/^@umbraco/],
		},
	},
});