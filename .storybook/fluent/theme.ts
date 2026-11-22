// Copied from microsoft/fluentui
// packages/react-components/react-storybook-addon/src/theme.ts (MIT, see
// LICENSE). Changes: the library's two schemes in place of Fluent's Web and
// Teams themes.
export const themes = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
] as const;

export const defaultTheme = themes[0];

export type Theme = (typeof themes)[number];
export type ThemeIds = Theme['id'];
export type ThemeLabels = Theme['label'];
