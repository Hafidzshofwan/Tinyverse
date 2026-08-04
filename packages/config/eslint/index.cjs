/**
 * Shared ESLint config for TinyVerse.
 *
 * Enforces Feature-Sliced Design (FSD) layer boundaries: imports may only
 * point DOWNWARD through the layers. This guardrail is active from Phase 1
 * even though there is no product code yet, so the very first feature added
 * is already constrained.
 *
 *   app -> processes -> widgets -> features -> entities -> shared
 */
module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: "module",
		ecmaFeatures: { jsx: true },
	},
	// Batas lapisan FSD diurus penuh oleh eslint-plugin-boundaries.
	// eslint-plugin-import pernah didaftarkan di sini tanpa satu pun aturan
	// import/* aktif, jadi dicopot dari daftar plugin. Paketnya dibiarkan
	// terpasang di package.json agar pnpm-lock.yaml tidak berubah.
	plugins: ["@typescript-eslint", "boundaries"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:boundaries/recommended",
		"eslint-config-prettier",
	],
	settings: {
		"boundaries/include": ["src/**/*"],
		"boundaries/elements": [
			{ type: "app", pattern: "src/app/**" },
			{ type: "processes", pattern: "src/processes/**" },
			{ type: "widgets", pattern: "src/widgets/**" },
			{ type: "features", pattern: "src/features/**" },
			{ type: "entities", pattern: "src/entities/**" },
			{ type: "shared", pattern: "src/shared/**" },
		],
	},
	rules: {
		"boundaries/element-types": [
			"error",
			{
				default: "disallow",
				rules: [
					{ from: "app", allow: ["processes", "widgets", "features", "entities", "shared"] },
					{ from: "processes", allow: ["widgets", "features", "entities", "shared"] },
					{ from: "widgets", allow: ["features", "entities", "shared"] },
					{ from: "features", allow: ["entities", "shared"] },
					{ from: "entities", allow: ["shared"] },
					{ from: "shared", allow: ["shared"] },
				],
			},
		],
	},
	ignorePatterns: ["node_modules/", ".next/", "dist/", ".turbo/"],
};
