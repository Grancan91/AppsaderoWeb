import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    rules: {
      // Google style guide rules
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      "no-undef": "error",
      "comma-dangle": ["error", "always-multiline"],
      "no-trailing-spaces": "error",
      "space-before-function-paren": ["error", {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "always"
      }],
      "arrow-spacing": "error",
      "keyword-spacing": "error",
      "space-infix-ops": "error",
      "eqeqeq": ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
    },
  },
  prettier,
  globalIgnores([
    "node_modules/**",
    ".env*",
  ]),
]);

export default eslintConfig;
