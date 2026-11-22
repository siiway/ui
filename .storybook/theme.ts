// The Storybook around the docs, styled as Fluent UI's own
// (react.fluentui.dev): Fluent's font stack, the brand blue for what's
// selected. After microsoft/fluentui apps/public-docsite-v9/.storybook/theme.js,
// plus a dark one, which follows the docs pages' Scheme picker.

import { create } from "storybook/theming";

export const FONT =
  '"Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif';
const MONO = '"Cascadia Code", Menlo, "Courier New", Courier, monospace';

const brand = (color: string) =>
  `<span style="display:inline-flex;align-items:center;gap:10px;font-size:16px;font-weight:600;color:${color}"><img src="./icon.svg" alt="" width="28" height="28" />SiiWay UI</span>`;

export const lightTheme = create({
  base: "light",
  colorPrimary: "rgba(255, 255, 255, .4)",
  colorSecondary: "#0078d4",
  appBg: "#ffffff",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: "#e0e0e0",
  appBorderRadius: 4,
  fontBase: FONT,
  fontCode: MONO,
  textColor: "#11100f",
  textInverseColor: "#0078d4",
  textMutedColor: "#616161",
  barSelectedColor: "#0078d4",
  inputBorderRadius: 4,
  brandTitle: brand("#11100f"),
  brandUrl: "./",
  brandTarget: "_self",
});

// The library's dark canvas (CANVAS.dark) and greys.
export const darkTheme = create({
  base: "dark",
  colorPrimary: "rgba(0, 0, 0, .4)",
  colorSecondary: "#0078d4",
  appBg: "#1a1a1a",
  appContentBg: "#1a1a1a",
  appPreviewBg: "#1a1a1a",
  appBorderColor: "#333333",
  appBorderRadius: 4,
  fontBase: FONT,
  fontCode: MONO,
  textColor: "#ffffff",
  textInverseColor: "#479ef5",
  textMutedColor: "#adadad",
  barBg: "#1a1a1a",
  barTextColor: "#d6d6d6",
  barSelectedColor: "#479ef5",
  inputBg: "#262626",
  inputBorder: "#3d3d3d",
  inputTextColor: "#ffffff",
  inputBorderRadius: 4,
  brandTitle: brand("#ffffff"),
  brandUrl: "./",
  brandTarget: "_self",
});

/** The OS setting, for a first visit, before anyone picks. */
export function systemScheme(): "light" | "dark" {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}
