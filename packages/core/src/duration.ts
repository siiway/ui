// Parse durations people type, like "60min", "1 hour", "30 days", into whole
// minutes or days, depending on the field's storage unit. A bare number is in
// the field's unit. The unit words come from the library's strings
// (`UiStrings.durationUnits`), so each language reads its own; English by
// default.

import { en } from "./i18n/en.js";

export type DurationUnit = "minutes" | "days";

/** The units a duration can be typed in. A month is 30 days, a year 365. */
export type DurationUnitKey = "s" | "m" | "h" | "d" | "w" | "mo" | "y";

/** One language's words for each unit, matched ignoring case. */
export type DurationUnitWords = Record<DurationUnitKey, readonly string[]>;

/**
 * Parse a duration string. Returns the integer count in the field's
 * `defaultUnit`, or `null` for an empty string ("use the site default"),
 * or a `string` error code for an unparseable input.
 */
export type ParseResult =
  | { kind: "ok"; value: number }
  | { kind: "blank" }
  | { kind: "error"; reason: "format" | "non_positive" | "unknown_unit" };

function unitFor(
  word: string,
  units: DurationUnitWords | readonly DurationUnitWords[],
): DurationUnitKey | null {
  const tables =
    "s" in units ? [units as DurationUnitWords] : (units as readonly DurationUnitWords[]);
  for (const table of tables) {
    for (const key of Object.keys(table) as DurationUnitKey[]) {
      if (table[key].some((name) => name.toLowerCase() === word)) return key;
    }
  }
  return null;
}

/** Reads `input` with the unit words of `units`, one language or several. */
export function parseDuration(
  input: string,
  defaultUnit: DurationUnit,
  units: DurationUnitWords | readonly DurationUnitWords[] = en.durationUnits,
): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { kind: "blank" };

  // Strict: a number, optional whitespace, optional unit word (letters, in
  // any script). Reject anything else (commas, multiple numbers, units
  // without a number, etc.).
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*(\p{L}*)$/u);
  if (!match) return { kind: "error", reason: "format" };

  const num = parseFloat(match[1]!);
  if (!Number.isFinite(num) || num <= 0) {
    return { kind: "error", reason: "non_positive" };
  }

  const unitRaw = (match[2] ?? "").toLowerCase();
  const canonical = unitRaw === "" ? null : unitFor(unitRaw, units);
  if (unitRaw !== "" && !canonical) {
    return { kind: "error", reason: "unknown_unit" };
  }

  // Convert to minutes first, then down to the field's unit.
  let totalMinutes: number;
  switch (canonical) {
    case "s":
      totalMinutes = num / 60;
      break;
    case "m":
      totalMinutes = num;
      break;
    case "h":
      totalMinutes = num * 60;
      break;
    case "d":
      totalMinutes = num * 60 * 24;
      break;
    case "w":
      totalMinutes = num * 60 * 24 * 7;
      break;
    case "mo":
      totalMinutes = num * 60 * 24 * 30;
      break;
    case "y":
      totalMinutes = num * 60 * 24 * 365;
      break;
    case null:
      // No unit — interpret in the field's default unit.
      totalMinutes = defaultUnit === "minutes" ? num : num * 60 * 24;
      break;
    default: {
      // Exhaustiveness check.
      const _exhaustive: never = canonical;
      void _exhaustive;
      totalMinutes = num;
    }
  }

  const value =
    defaultUnit === "minutes" ? Math.round(totalMinutes) : Math.round(totalMinutes / (60 * 24));

  // Round-down for very small inputs (e.g. "30s" in a days-unit field) but
  // never let a positive duration round to 0 — that would mint zero-TTL
  // tokens. Clamp to 1 of the field's unit.
  if (value < 1) return { kind: "ok", value: 1 };
  return { kind: "ok", value };
}

/**
 * Format an integer count with its unit, in English. The duration field
 * shows the app's language instead (`UiStrings.duration`).
 */
export function formatDuration(value: number, defaultUnit: DurationUnit): string {
  return en.duration(value, defaultUnit);
}
