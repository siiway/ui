import type { Scheme } from "../scheme.js";

// Only floating surfaces (menus, popovers, dialogs) use these; page content is
// flat and separated by borders alone.

const LIGHT = {
  shadow2: "0 1px 2px rgba(0, 0, 0, 0.05)",
  shadow4: "0 1px 3px rgba(0, 0, 0, 0.07), 0 1px 2px rgba(0, 0, 0, 0.04)",
  shadow8: "0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)",
  shadow16: "0 8px 24px rgba(0, 0, 0, 0.10), 0 2px 6px rgba(0, 0, 0, 0.05)",
  shadow28: "0 14px 36px rgba(0, 0, 0, 0.14), 0 3px 8px rgba(0, 0, 0, 0.06)",
  shadow64: "0 24px 64px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08)",
};

const DARK: typeof LIGHT = {
  shadow2: "0 1px 2px rgba(0, 0, 0, 0.5)",
  shadow4: "0 1px 3px rgba(0, 0, 0, 0.55), 0 1px 2px rgba(0, 0, 0, 0.4)",
  shadow8: "0 4px 12px rgba(0, 0, 0, 0.55), 0 1px 3px rgba(0, 0, 0, 0.4)",
  shadow16: "0 8px 24px rgba(0, 0, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.4)",
  shadow28: "0 14px 36px rgba(0, 0, 0, 0.65), 0 3px 8px rgba(0, 0, 0, 0.4)",
  shadow64: "0 24px 64px rgba(0, 0, 0, 0.7), 0 4px 12px rgba(0, 0, 0, 0.45)",
};

export type ShadowTokens = typeof LIGHT;

/** Shadows for floating surfaces, per scheme. */
export const SHADOWS: Record<Scheme, ShadowTokens> = { light: LIGHT, dark: DARK };
