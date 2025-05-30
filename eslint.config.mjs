import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import eslint from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
  baseDirectory: dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    extends: compat.extends(
      "airbnb",
    ),

    plugins: {
      "@stylistic": stylistic,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: "latest",
      },
    },

    settings: {
      "import/resolver": {
        alias: {
          map: [["babel-polyfill", "babel-polyfill/dist/polyfill.min.js"], ["@", "./src/"]],
          extensions: [".js", ".ts", ".jsx", ".tsx"],
        },

        typescript: {},
      },
    },

    rules: {
      quotes: ["error", "double"],
      "react/react-in-jsx-scope": "off",

      "react/jsx-filename-extension": ["error", {
        extensions: [".jsx", ".tsx"],
      }],

      "import/extensions": ["error", "ignorePackages", {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      }],
    },
  },
);
