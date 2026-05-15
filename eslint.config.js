import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "dist",
      "node_modules",
      "src/index.js",
      "src/config/**",
      "src/database/**",
      "src/modules/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }
      ],
      "react-hooks/set-state-in-effect": "off",
    },
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        ...globals.browser,
        console: "readonly"
      },
    },
  },
];
