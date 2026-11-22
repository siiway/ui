import { describe, expect, test } from "bun:test";
import { DEFAULT_ACCENT, themeOverrides } from "@siiway/ui-core";
import { createTheme } from "../src/index.js";

describe("createTheme", () => {
  test("light primary buttons are exactly the accent", () => {
    for (const accent of ["#0078d4", "#e81123", "#5c2d91"]) {
      expect(createTheme({ scheme: "light", accent }).colorBrandBackground).toBe(accent);
    }
  });

  test("a missing or invalid accent gives the default", () => {
    expect(createTheme({ scheme: "light" }).colorBrandBackground).toBe(DEFAULT_ACCENT);
    expect(createTheme({ scheme: "light", accent: "nope" }).colorBrandBackground).toBe(
      DEFAULT_ACCENT,
    );
  });

  test("applies the SiiWay overrides on top of Fluent's theme", () => {
    for (const scheme of ["light", "dark"] as const) {
      const theme = createTheme({ scheme });
      for (const [key, value] of Object.entries(themeOverrides(scheme))) {
        expect(theme[key as keyof typeof theme], key).toBe(value);
      }
    }
  });

  // Any change to the palette, radii, shadows or brand ramp shows up here, so
  // it has to be deliberate: update with `bun test --update-snapshots`.
  test("matches the snapshot", () => {
    expect(createTheme({ scheme: "light" })).toMatchSnapshot();
    expect(createTheme({ scheme: "dark" })).toMatchSnapshot();
  });
});
