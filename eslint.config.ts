import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // .storybook/fluent is Fluent's code, kept close to theirs to compare.
  globalIgnores([
    "**/dist",
    "**/node_modules",
    ".claude",
    "storybook-static",
    ".wrangler",
    ".storybook/fluent",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { ecmaVersion: 2022 },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
  // core imports no framework and runs anywhere: no browser or Node globals.
  {
    files: ["packages/core/src/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [{ regex: "^[^.]", message: "@siiway/ui-core has no dependencies." }] },
      ],
    },
  },
  {
    files: ["packages/react/**/*.{ts,tsx}", "docs/**/*.{ts,tsx}", ".storybook/**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
  },
  // The library must render on the server: no router, no i18n framework, no
  // data fetching. Links and navigation come from <UiProvider router>.
  {
    files: ["packages/react/src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "react-router", message: "Use useUiLink() / useUiNavigate()." },
            { name: "react-router-dom", message: "Use useUiLink() / useUiNavigate()." },
            { name: "react-i18next", message: "Use useUiStrings()." },
            { name: "i18next", message: "Use useUiStrings()." },
          ],
        },
      ],
    },
  },
  {
    files: ["scripts/**/*.ts", "eslint.config.ts", "packages/*/test/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.node },
  },
]);
