import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: {
      "js": js,
      "@typescript-eslint": tseslint.plugin,
      "unused-imports": unusedImportsPlugin,
      "simple-import-sort": simpleImportSortPlugin,
      "prettier": prettierPlugin
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json", // ← プロジェクトルートのtsconfigを使う（必要なら）
      },
      globals: globals.node
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "prettier/prettier": "error",
      "no-console": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
      ],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_"
        }
      ],
    }
  }
]);
