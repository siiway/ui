import { describe, expect, test } from "bun:test";
import {
  CANVAS,
  THEME_STORAGE_KEY,
  isThemeMode,
  resolveScheme,
  schemeBootScript,
  type SchemeBootOptions,
} from "../src/index.js";

test("resolveScheme: a fixed mode wins, system follows the OS", () => {
  expect(resolveScheme("dark", false)).toBe("dark");
  expect(resolveScheme("light", true)).toBe("light");
  expect(resolveScheme("system", true)).toBe("dark");
  expect(resolveScheme("system", false)).toBe("light");
});

test("isThemeMode accepts the three modes only", () => {
  for (const mode of ["system", "light", "dark"]) expect(isThemeMode(mode)).toBe(true);
  for (const other of ["", "Dark", "auto", null, undefined, 1])
    expect(isThemeMode(other)).toBe(false);
});

// Runs the boot script against a stand-in page: what's stored, the OS setting.
function boot(stored: string | null | "throws", osDark: boolean, options?: SchemeBootOptions) {
  const attributes: Record<string, string> = {};
  const style: Record<string, string> = {};
  const localStorage = {
    getItem(key: string) {
      if (stored === "throws") throw new Error("blocked");
      return key === (options?.storageKey ?? THEME_STORAGE_KEY) ? stored : null;
    },
  };
  const matchMedia = (query: string) => ({
    matches: osDark && query === "(prefers-color-scheme: dark)",
  });
  const document = {
    documentElement: {
      setAttribute: (name: string, value: string) => (attributes[name] = value),
      style,
    },
  };
  new Function("localStorage", "matchMedia", "document", schemeBootScript(options))(
    localStorage,
    matchMedia,
    document,
  );
  return {
    scheme: attributes["data-scheme"],
    colorScheme: style.colorScheme,
    background: style.backgroundColor,
  };
}

describe("schemeBootScript", () => {
  test("draws the stored scheme, whatever the OS", () => {
    expect(boot("dark", false)).toEqual({
      scheme: "dark",
      colorScheme: "dark",
      background: CANVAS.dark,
    });
    expect(boot("light", true)).toEqual({
      scheme: "light",
      colorScheme: "light",
      background: CANVAS.light,
    });
  });

  test("follows the OS for system, nothing stored, junk, or blocked storage", () => {
    for (const stored of ["system", null, "purple", "throws"] as const) {
      expect(boot(stored, true).scheme).toBe("dark");
      expect(boot(stored, false).scheme).toBe("light");
    }
  });

  test("takes its key and default from the options", () => {
    expect(boot("dark", false, { storageKey: "my-theme" }).scheme).toBe("dark");
    expect(boot(null, true, { defaultMode: "light" }).scheme).toBe("light");
  });

  test("is safe inside an inline <script>", () => {
    const script = schemeBootScript({ storageKey: "</script><script>alert(1)</script>" });
    expect(script).not.toContain("</script");
    expect(boot("dark", false, { storageKey: "</script>" }).scheme).toBe("dark");
  });
});
