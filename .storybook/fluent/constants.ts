// Copied from microsoft/fluentui
// packages/react-components/react-storybook-addon/src/constants.ts (MIT, see
// LICENSE). Changes: our own prefix, which shows in a page's URL
// (`globals=siiway_theme:dark`), and the language.
export const ADDON_ID = 'siiway';

export const DIR_ID = `${ADDON_ID}_dir` as const;
export const STRICT_MODE_ID = `${ADDON_ID}_strict-mode` as const;
export const THEME_ID = `${ADDON_ID}_theme` as const;
export const THEMES = `${ADDON_ID}_themes` as const;
export const LOCALE_ID = `${ADDON_ID}_locale` as const;
