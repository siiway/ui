import { en } from "./en.js";
import type { UiLocale, UiStrings } from "./types.js";
import { zh } from "./zh.js";

export type { UiLocale, UiStrings } from "./types.js";

export const UI_STRINGS: Record<UiLocale, UiStrings> = { en, zh };

/**
 * The library locale for a BCP-47 tag: any `zh` tag (`zh`, `zh-CN`,
 * `zh-Hans-CN`) is `zh`, everything else is `en`.
 */
export function uiLocale(locale: string | null | undefined): UiLocale {
  return locale?.trim().toLowerCase().split(/[-_]/)[0] === "zh" ? "zh" : "en";
}

/** The strings for a BCP-47 tag, with any of them replaced by `overrides`. */
export function pickStrings(
  locale: string | null | undefined,
  overrides?: Partial<UiStrings>,
): UiStrings {
  const base = UI_STRINGS[uiLocale(locale)];
  return overrides ? { ...base, ...overrides } : base;
}
