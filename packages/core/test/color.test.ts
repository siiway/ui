import { describe, expect, test } from "bun:test";
import {
  hexToHsl,
  hexToHsv,
  hslToHex,
  hsvToHex,
  normalizeAccent,
  normalizeHexColor,
} from "../src/index.js";

describe("normalizeHexColor", () => {
  test("accepts three or six digits, with or without #", () => {
    expect(normalizeHexColor("#AABBCC")).toBe("#aabbcc");
    expect(normalizeHexColor("aabbcc")).toBe("#aabbcc");
    expect(normalizeHexColor(" #abc ")).toBe("#aabbcc");
    expect(normalizeHexColor("abc")).toBe("#aabbcc");
  });

  test("rejects anything else", () => {
    expect(normalizeHexColor("#abcd")).toBeNull();
    expect(normalizeHexColor("#aabbccdd")).toBeNull();
    expect(normalizeHexColor("red")).toBeNull();
    expect(normalizeHexColor("")).toBeNull();
  });
});

describe("normalizeAccent", () => {
  const fallback = "#0078d4";

  test("expands short forms and drops alpha", () => {
    expect(normalizeAccent("#abc", fallback)).toBe("#aabbcc");
    expect(normalizeAccent("#abcd", fallback)).toBe("#aabbcc");
    expect(normalizeAccent("#AABBCC", fallback)).toBe("#aabbcc");
    expect(normalizeAccent("#aabbccdd", fallback)).toBe("#aabbcc");
  });

  test("falls back on missing or invalid input", () => {
    expect(normalizeAccent(undefined, fallback)).toBe(fallback);
    expect(normalizeAccent(null, fallback)).toBe(fallback);
    expect(normalizeAccent("", fallback)).toBe(fallback);
    expect(normalizeAccent("aabbcc", fallback)).toBe(fallback);
    expect(normalizeAccent("#ggg", fallback)).toBe(fallback);
  });
});

describe("HSL and HSV", () => {
  const colors = ["#0078d4", "#000000", "#ffffff", "#808080", "#e81123", "#107c10", "#5c2d91"];

  test("hex → HSL → hex is lossless", () => {
    for (const hex of colors) {
      const [h, s, l] = hexToHsl(hex);
      expect(hslToHex(h, s, l)).toBe(hex);
    }
  });

  test("hex → HSV → hex is lossless", () => {
    for (const hex of colors) expect(hsvToHex(hexToHsv(hex)!)).toBe(hex);
  });

  test("converts primary colors between hex and HSV", () => {
    expect(hexToHsv("#ff0000")).toEqual({ h: 0, s: 1, v: 1 });
    expect(hexToHsv("#00ff00")).toEqual({ h: 120, s: 1, v: 1 });
    expect(hexToHsv("#0000ff")).toEqual({ h: 240, s: 1, v: 1 });
    expect(hsvToHex({ h: 240, s: 1, v: 1 })).toBe("#0000ff");
  });

  test("hexToHsv rejects invalid input", () => {
    expect(hexToHsv("nope")).toBeNull();
  });
});
