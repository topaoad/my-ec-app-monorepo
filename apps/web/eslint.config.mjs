import unusedImports from "eslint-plugin-unused-imports";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends("next/core-web-vitals"),
  {
    plugins: {
      "unused-imports": unusedImports,
    },

    rules: {
      quotes: ["warn", "double"],
      semi: ["warn", "always"],
      "no-unused-vars": ["warn"],
      "unused-imports/no-unused-imports": "error",

      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      "comma-dangle": ["warn", "always-multiline"],
      "no-console": ["off"],
      indent: ["warn", 2],
      curly: ["warn", "all"],

      "react/jsx-filename-extension": [
        1,
        {
          extensions: [".jsx", ".tsx"],
        },
      ],

      "react/prop-types": "off",
      "import/no-unresolved": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
