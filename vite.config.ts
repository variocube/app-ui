import {splash} from "@variocube/vite-plugins";
import react from "@vitejs/plugin-react";
import {readFileSync} from "fs";
import {defineConfig, Plugin} from "vite";
import checker from "vite-plugin-checker";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

// Custom plugin to handle ?source imports (same as ?raw but with ?source query param)
function sourcePlugin(): Plugin {
	return {
		name: "vite-plugin-source",
		transform(_code, id) {
			// Handle ?source query parameter by reading the raw file
			const [filepath, query] = id.split("?");
			if (query === "source") {
				const fs = require("fs");
				const rawSource = fs.readFileSync(filepath, "utf-8");
				return {
					code: `export default ${JSON.stringify(rawSource)}`,
					map: null,
				};
			}
		},
	};
}

export default defineConfig({
	plugins: [
		react(),
		splash(),
		sourcePlugin(),
		checker({
			typescript: true,
		}),
	],
	define: {
		VERSION: JSON.stringify(packageJson.version),
	},
	build: {
		outDir: "build",
		emptyOutDir: true,
	},
	server: {
		port: 3000,
	},
	base: "",
});
