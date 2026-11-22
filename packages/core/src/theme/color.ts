// Colour conversions for the brand ramp (HSL) and the colour picker (HSV).

const HEX_COLOR = /^#?([0-9a-f]{6})$/i;
const SHORT_HEX_COLOR = /^#?([0-9a-f]{3})$/i;
const ACCENT_HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/**
 * Normalizes a colour a person typed: three or six hex digits, `#` optional.
 * Returns lowercase `#rrggbb`, or null when the input isn't one.
 */
export function normalizeHexColor(value: string): string | null {
  const input = value.trim();
  const full = HEX_COLOR.exec(input);
  if (full) return `#${full[1]!.toLowerCase()}`;

  const short = SHORT_HEX_COLOR.exec(input);
  if (!short) return null;

  return `#${[...short[1]!].map((digit) => digit.repeat(2)).join("")}`.toLowerCase();
}

/**
 * Normalizes a configured accent: `#rgb`, `#rgba`, `#rrggbb` or `#rrggbbaa`.
 * Alpha has no meaning for a brand ramp, so it is dropped. Anything else, or
 * nothing, gives `fallback`.
 */
export function normalizeAccent(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  const m = ACCENT_HEX.exec(value.trim());
  if (!m) return fallback;
  const digits = m[1]!.toLowerCase();
  if (digits.length <= 4) {
    return `#${digits
      .slice(0, 3)
      .split("")
      .map((c) => c + c)
      .join("")}`;
  }
  return `#${digits.slice(0, 6)}`;
}

/** `#rrggbb` → [hue 0–360, saturation 0–100, lightness 0–100], unrounded. */
export function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s * 100, l * 100];
}

/** Hue 0–360, saturation 0–100, lightness 0–100 → lowercase `#rrggbb`. */
export function hslToHex(h: number, s: number, l: number): string {
  const hN = h / 360;
  const sN = s / 100;
  const lN = l / 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r: number, g: number, b: number;
  if (sN === 0) {
    r = g = b = lN;
  } else {
    const q = lN < 0.5 ? lN * (1 + sN) : lN + sN - lN * sN;
    const p = 2 * lN - q;
    r = hue2rgb(p, q, hN + 1 / 3);
    g = hue2rgb(p, q, hN);
    b = hue2rgb(p, q, hN - 1 / 3);
  }
  const hex = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/** Hue 0–360, saturation and value 0–1. */
export interface HsvColor {
  h: number;
  s: number;
  v: number;
}

/** Any colour normalizeHexColor accepts → HSV, or null. */
export function hexToHsv(value: string): HsvColor | null {
  const normalized = normalizeHexColor(value);
  if (!normalized) return null;

  const red = Number.parseInt(normalized.slice(1, 3), 16) / 255;
  const green = Number.parseInt(normalized.slice(3, 5), 16) / 255;
  const blue = Number.parseInt(normalized.slice(5, 7), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (max === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }

  if (hue < 0) hue += 360;
  return { h: hue, s: max === 0 ? 0 : delta / max, v: max };
}

/** HSV → lowercase `#rrggbb`. Out-of-range values are clamped. */
export function hsvToHex({ h, s, v }: HsvColor): string {
  const hue = ((h % 360) + 360) % 360;
  const saturation = Math.min(1, Math.max(0, s));
  const value = Math.min(1, Math.max(0, v));
  const chroma = value * saturation;
  const section = hue / 60;
  const secondary = chroma * (1 - Math.abs((section % 2) - 1));
  const offset = value - chroma;
  let rgb: [number, number, number];

  if (section < 1) rgb = [chroma, secondary, 0];
  else if (section < 2) rgb = [secondary, chroma, 0];
  else if (section < 3) rgb = [0, chroma, secondary];
  else if (section < 4) rgb = [0, secondary, chroma];
  else if (section < 5) rgb = [secondary, 0, chroma];
  else rgb = [chroma, 0, secondary];

  return `#${rgb
    .map((channel) =>
      Math.round((channel + offset) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}
