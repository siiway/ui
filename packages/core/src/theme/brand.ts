import { hexToHsl, hslToHex, normalizeAccent } from "./color.js";

/** Fluent's default blue, used when no accent is configured. */
export const DEFAULT_ACCENT = "#0078d4";

export const BRAND_SHADES = [
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
] as const;

export type BrandShade = (typeof BRAND_SHADES)[number];

/** Sixteen shades of one hue, darkest (10) to lightest (160). Fluent calls this BrandVariants. */
export type BrandRamp = Record<BrandShade, string>;

/**
 * Builds the brand ramp around an accent colour.
 *
 * Fluent ramps run dark → light: light themes tint surfaces with the high
 * shades and dark themes lift foregrounds with them. The accent is anchored
 * at shade 80, which the light theme uses for primary buttons, links and
 * focus, so those stay exactly the colour that was configured. Each step is
 * 7 points of lightness, clamped to 5–96.
 */
export function brandRamp(accent?: string | null): BrandRamp {
  const [h, s, l] = hexToHsl(normalizeAccent(accent, DEFAULT_ACCENT));
  const ramp = {} as BrandRamp;
  BRAND_SHADES.forEach((shade, i) => {
    const lightness = Math.max(5, Math.min(96, l + (i - 7) * 7));
    ramp[shade] = hslToHex(h, s, lightness);
  });
  return ramp;
}
