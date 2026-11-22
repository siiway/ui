import { describe, expect, test } from "bun:test";
import { UI_STRINGS, formatDuration, parseDuration } from "../src/index.js";

const { zh } = UI_STRINGS;

describe("parseDuration", () => {
  test("reads units into the field's unit", () => {
    expect(parseDuration("60min", "minutes")).toEqual({ kind: "ok", value: 60 });
    expect(parseDuration("1 hour", "minutes")).toEqual({ kind: "ok", value: 60 });
    expect(parseDuration("2w", "days")).toEqual({ kind: "ok", value: 14 });
    expect(parseDuration("30", "days")).toEqual({ kind: "ok", value: 30 });
  });

  test("reads another language's unit words", () => {
    const units = zh.durationUnits;
    expect(parseDuration("90 分钟", "minutes", units)).toEqual({ kind: "ok", value: 90 });
    expect(parseDuration("1小时", "minutes", units)).toEqual({ kind: "ok", value: 60 });
    expect(parseDuration("2 周", "days", units)).toEqual({ kind: "ok", value: 14 });
    expect(parseDuration("1 hour", "minutes", units)).toEqual({
      kind: "error",
      reason: "unknown_unit",
    });
  });

  test("reads back what each language shows", () => {
    for (const strings of Object.values(UI_STRINGS)) {
      for (const unit of ["minutes", "days"] as const) {
        for (const value of [1, 30]) {
          expect(parseDuration(strings.duration(value, unit), unit, strings.durationUnits)).toEqual(
            {
              kind: "ok",
              value,
            },
          );
        }
      }
    }
  });

  test("never rounds a positive duration to zero", () => {
    expect(parseDuration("30s", "days")).toEqual({ kind: "ok", value: 1 });
  });

  test("reports blank and invalid input", () => {
    expect(parseDuration("  ", "days")).toEqual({ kind: "blank" });
    expect(parseDuration("1,5d", "days")).toEqual({ kind: "error", reason: "format" });
    expect(parseDuration("0", "days")).toEqual({ kind: "error", reason: "non_positive" });
    expect(parseDuration("3 fortnights", "days")).toEqual({
      kind: "error",
      reason: "unknown_unit",
    });
  });
});

test("formatDuration", () => {
  expect(formatDuration(30, "days")).toBe("30 days");
  expect(formatDuration(60, "minutes")).toBe("60 min");
});
