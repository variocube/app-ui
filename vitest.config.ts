import {defineConfig} from "vitest/config";

// Separate from vite.config.ts, which builds the demo with plugins the tests don't need.
export default defineConfig({
	test: {
		environment: "node",
		include: ["src/**/*.spec.{ts,tsx}"],
	},
});
