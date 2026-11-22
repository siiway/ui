// The gallery: Storybook, set up as Fluent UI's own
// (microsoft/fluentui .storybook/main.js and
// apps/public-docsite-v9/.storybook/main.js) on Vite. docs/ holds the guides
// (MDX) and, per component, its stories, from which Storybook makes its page.

import type { StorybookConfig } from "@storybook/react-vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import remarkGfm from "remark-gfm";
import { mergeConfig } from "vite";

// The packages' source, not their build: edits show without `bun run build`.
const source = (pkg: string) =>
  fileURLToPath(new URL(`../packages/${pkg}/src/index.ts`, import.meta.url));

const config: StorybookConfig = {
  stories: ["../docs/**/*.mdx", "../docs/**/*.stories.tsx"],
  addons: [
    {
      name: "@storybook/addon-docs",
      // Enable GitHub Flavored Markdown support in MDX files
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
  ],
  framework: "@storybook/react-vite",
  staticDirs: ["../docs/public"],
  core: { disableTelemetry: true },
  // As Fluent's: the sidebar lists docs pages, not stories.
  docs: { docsMode: true },
  // Each component page's props table, from the props' types and their doc
  // comments in packages/react/src.
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      tsconfigPath: fileURLToPath(new URL("../packages/react/tsconfig.json", import.meta.url)),
      include: ["packages/react/src/**/*.tsx"],
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Only the library's own props, not those it passes on to React's or
      // Fluent's elements.
      propFilter: (prop) => !prop.parent || !/node_modules/.test(prop.parent.fileName),
    },
  },
  viteFinal: (vite) =>
    mergeConfig(vite, {
      plugins: [react()],
      resolve: {
        alias: { "@siiway/ui-core": source("core"), "@siiway/ui-react": source("react") },
      },
    }),
};

export default config;
