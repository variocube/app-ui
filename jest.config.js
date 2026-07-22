/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/src/"],
	transform: {
		"^.+\\.tsx?$": ["ts-jest", {
			// The library build targets ESM and doesn't need esModuleInterop, but jest compiles to CommonJS,
			// where default imports (e.g. `import React from "react"`) require the interop helpers.
			tsconfig: {esModuleInterop: true},
		}],
	},
};
