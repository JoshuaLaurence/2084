import {defineConfig} from "vite";

export default defineConfig({
	build: {
		chunkSizeWarningLimit: 2000,
	},
	assetsInclude: ["assets/"],
});
