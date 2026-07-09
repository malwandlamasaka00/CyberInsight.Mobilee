import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";

export default [
  js.configs.recommended,

  {
    files: ["**/*.{js,jsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },

      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        localStorage: "readonly",
        fetch: "readonly"
      }
    },

    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh
    },

    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",

      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      ...reactHooks.configs.recommended.rules
    },

    settings: {
      react: {
        version: "detect"
      }
    }
  }
];