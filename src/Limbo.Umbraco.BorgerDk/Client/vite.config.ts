import { defineConfig } from 'vite';

// The bundle is emitted straight into "wwwroot/dist", which the Razor SDK exposes as
// "/App_Plugins/Limbo.Umbraco.BorgerDk/dist" via the "StaticWebAssetBasePath" of the csproj.
export default defineConfig({
	build: {
		lib: {
			entry: 'src/index.ts',
			formats: ['es'],
			fileName: 'limbo-borgerdk',
		},
		outDir: '../wwwroot/dist',
		emptyOutDir: true,
		sourcemap: true,
		rollupOptions: {
			// The backoffice is provided by Umbraco at runtime and must never be bundled.
			external: [/^@umbraco/],
		},
	},
	base: '/App_Plugins/Limbo.Umbraco.BorgerDk/dist/',
});
