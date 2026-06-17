import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import litPlugin from "eslint-plugin-lit";
import wcPlugin from "eslint-plugin-wc";

export default [
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      lit: litPlugin,
      wc: wcPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...litPlugin.configs.recommended.rules,
      ...wcPlugin.configs.recommended.rules,
    },
  },
  {
    ignores: ["dist/", "node_modules/"],
  },
];
