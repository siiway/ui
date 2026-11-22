import { describe, expect, test } from "bun:test";
import { UI_STRINGS, pickStrings, uiLocale, type UiStrings } from "../src/index.js";

describe("uiLocale", () => {
  test("maps every zh tag to zh", () => {
    for (const tag of ["zh", "zh-CN", "zh-Hans", "zh-Hant-TW", "zh_CN", "ZH-cn"]) {
      expect(uiLocale(tag)).toBe("zh");
    }
  });

  test("maps everything else to en", () => {
    for (const tag of ["en", "en-US", "ja", "zhx", "", null, undefined]) {
      expect(uiLocale(tag)).toBe("en");
    }
  });
});

describe("pickStrings", () => {
  test("returns the locale's strings", () => {
    expect(pickStrings("zh-CN").copy).toBe("复制");
    expect(pickStrings("en-US").copy).toBe("Copy");
  });

  test("applies overrides", () => {
    const strings = pickStrings("en", { copy: "Copy ID" });
    expect(strings.copy).toBe("Copy ID");
    expect(strings.close).toBe("Close");
    expect(UI_STRINGS.en.copy).toBe("Copy");
  });

  test("pluralizes and fills in values", () => {
    expect(pickStrings("en").totalItems(1)).toBe("1 item");
    expect(pickStrings("en").totalItems(3)).toBe("3 items");
    expect(pickStrings("zh").totalItems(3)).toBe("共 3 项");
    expect(pickStrings("en").pageOf(2, 7)).toBe("2 / 7");
  });
});

test("no locale has an empty string", () => {
  for (const strings of Object.values(UI_STRINGS)) {
    for (const [key, value] of Object.entries(strings) as [keyof UiStrings, unknown][]) {
      if (key === "durationUnits") {
        for (const words of Object.values(strings.durationUnits)) {
          expect(words.length > 0 && words.every((word) => word.trim() !== ""), key).toBe(true);
        }
        continue;
      }
      const text =
        typeof value === "function" ? (value as (...a: number[]) => string)(1, 1) : value;
      expect(typeof text === "string" && text.trim() !== "", key).toBe(true);
    }
  }
});
