import type { Scheme } from "../scheme.js";
import { NEUTRAL, type NeutralTokens } from "../tokens/neutral.js";
import { RADII } from "../tokens/radii.js";
import { SHADOWS, type ShadowTokens } from "../tokens/shadows.js";

export type ThemeOverrides = typeof RADII & ShadowTokens & NeutralTokens;

/**
 * Every token the SiiWay look changes from Fluent's defaults, for one scheme.
 * Spread it over a Fluent theme built from brandRamp():
 * `{ ...createLightTheme(brandRamp(accent)), ...themeOverrides("light") }`.
 */
export function themeOverrides(scheme: Scheme): ThemeOverrides {
  return { ...RADII, ...SHADOWS[scheme], ...NEUTRAL[scheme] };
}
