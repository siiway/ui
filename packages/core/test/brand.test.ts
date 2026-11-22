import { describe, expect, test } from "bun:test";
import { BRAND_SHADES, DEFAULT_ACCENT, brandRamp, hexToHsl, themeOverrides } from "../src/index.js";

describe("brandRamp", () => {
  test("has every shade, darkest to lightest", () => {
    const ramp = brandRamp("#0078d4");
    expect(Object.keys(ramp).map(Number)).toEqual([...BRAND_SHADES]);
    const lightness = BRAND_SHADES.map((shade) => hexToHsl(ramp[shade])[2]);
    for (let i = 1; i < lightness.length; i++) {
      expect(lightness[i]!).toBeGreaterThanOrEqual(lightness[i - 1]!);
    }
  });

  test("keeps the accent exactly at shade 80", () => {
    for (const accent of ["#0078d4", "#e81123", "#107c10", "#5c2d91", "#ff8c00", "#00b7c3"]) {
      expect(brandRamp(accent)[80]).toBe(accent);
    }
    expect(brandRamp("#ABC")[80]).toBe("#aabbcc");
  });

  test("uses the default accent when none or an invalid one is given", () => {
    expect(brandRamp()[80]).toBe(DEFAULT_ACCENT);
    expect(brandRamp(null)[80]).toBe(DEFAULT_ACCENT);
    expect(brandRamp("blue")[80]).toBe(DEFAULT_ACCENT);
  });
});

describe("themeOverrides", () => {
  test("light and dark override the same tokens", () => {
    expect(Object.keys(themeOverrides("dark")).sort()).toEqual(
      Object.keys(themeOverrides("light")).sort(),
    );
  });

  test("neutrals win over radii and shadows", () => {
    const light = themeOverrides("light");
    expect(light.colorNeutralBackground1).toBe("#ffffff");
    expect(light.borderRadiusMedium).toBe("6px");
    expect(themeOverrides("dark").colorNeutralBackground1).toBe("#222222");
  });
});
