import globals from "globals";
import pluginJs from "@eslint/js";
import importPlugin from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		languageOptions: {
			globals: globals.node,
			ecmaVersion: "latest",
			sourceType: "module",
		},
	},
	pluginJs.configs.recommended,
	{
		plugins: {
			import: importPlugin,
		},
		rules: {
			"no-console": ["warn", { "allow": ["warn", "error", "info"] }],
			"no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }],
			"import/extensions": ["error", "always"],
			"indent": ["error", "tab"],
			"quotes": ["error", "double"],
			"semi": ["error", "always"],
			"comma-dangle": ["error", "always-multiline"],
			"object-curly-spacing": ["error", "always"],
			"arrow-parens": ["error", "always"],
			"no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
			"padding-line-between-statements": [
				"error",
				{ "blankLine": "always", "prev": "*", "next": "return" },
				{ "blankLine": "always", "prev": ["const", "let", "var"], "next": "*" },
				{ "blankLine": "any", "prev": ["const", "let", "var"], "next": ["const", "let", "var"] },
			],
		},
	},
];
