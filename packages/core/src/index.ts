export {
  SCHEME_COOKIE,
  THEME_STORAGE_KEY,
  isThemeMode,
  resolveScheme,
  schemeCookie,
  schemeFromRequest,
  type Scheme,
  type ThemeMode,
} from "./scheme.js";
export { schemeBootScript, type SchemeBootOptions } from "./boot.js";

export { NEUTRAL, type NeutralTokens } from "./tokens/neutral.js";
export { RADII } from "./tokens/radii.js";
export { SHADOWS, type ShadowTokens } from "./tokens/shadows.js";
export { CANVAS } from "./tokens/canvas.js";

export {
  normalizeHexColor,
  normalizeAccent,
  hexToHsl,
  hslToHex,
  hexToHsv,
  hsvToHex,
  type HsvColor,
} from "./theme/color.js";
export {
  DEFAULT_ACCENT,
  BRAND_SHADES,
  brandRamp,
  type BrandShade,
  type BrandRamp,
} from "./theme/brand.js";
export { themeOverrides, type ThemeOverrides } from "./theme/overrides.js";

export { UI_STRINGS, uiLocale, pickStrings, type UiLocale, type UiStrings } from "./i18n/index.js";

export {
  parseDuration,
  formatDuration,
  type DurationUnit,
  type DurationUnitKey,
  type DurationUnitWords,
  type ParseResult,
} from "./duration.js";
