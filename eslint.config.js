import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": "off",
    },
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        console: "readonly",
      },
    },
  },
];