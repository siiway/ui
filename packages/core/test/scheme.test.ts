import { describe, expect, test } from "bun:test";
import {
  CANVAS,
  SCHEME_COOKIE,
  THEME_STORAGE_KEY,
  isThemeMode,
  resolveScheme,
  schemeBootScript,
  schemeCookie,
  schemeFromRequest,
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

// Runs the boot script against a stand-in page: what's stored, the OS setting,
// the page's theme-color metas, whether it's a secure context.
function boot(
  stored: string | null | "throws",
  osDark: boolean,
  options?: SchemeBootOptions,
  themeColors: string[] = [],
  isSecureContext = false,
) {
  const attributes: Record<string, string> = {};
  const properties: Record<string, string> = {};
  const style: Record<string, unknown> = {
    setProperty: (name: string, value: string) => (properties[name] = value),
  };
  const metas = themeColors.map((content) => ({
    content,
    setAttribute(name: string, value: string) {
      if (name === "content") this.content = value;
    },
  }));
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
    cookie: undefined as string | undefined,
    documentElement: {
      setAttribute: (name: string, value: string) => (attributes[name] = value),
      style,
    },
    querySelectorAll: (selector: string) => (selector === 'meta[name="theme-color"]' ? metas : []),
  };
  new Function("localStorage", "matchMedia", "document", "self", schemeBootScript(options))(
    localStorage,
    matchMedia,
    document,
    { isSecureContext },
  );
  return {
    scheme: attributes["data-scheme"],
    colorScheme: style.colorScheme,
    background: style.backgroundColor,
    canvas: properties["--siiway-canvas"],
    themeColors: metas.map((meta) => meta.content),
    cookie: document.cookie,
  };
}

describe("schemeBootScript", () => {
  test("draws the stored scheme, whatever the OS", () => {
    expect(boot("dark", false)).toEqual({
      scheme: "dark",
      colorScheme: "dark",
      background: CANVAS.dark,
      canvas: CANVAS.dark,
      themeColors: [],
      cookie: undefined,
    });
    expect(boot("light", true)).toEqual({
      scheme: "light",
      colorScheme: "light",
      background: CANVAS.light,
      canvas: CANVAS.light,
      themeColors: [],
      cookie: undefined,
    });
  });

  test("sets each theme-color to the canvas", () => {
    // One per OS scheme, as pages often have: the stored choice wins.
    expect(boot("dark", false, undefined, ["#ffffff", "#000000"]).themeColors).toEqual([
      CANVAS.dark,
      CANVAS.dark,
    ]);
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

  test("with a cookie, writes the scheme there as schemeCookie does", () => {
    const options = { cookie: SCHEME_COOKIE };
    expect(boot("system", true, options).cookie).toBe(schemeCookie(SCHEME_COOKIE, "dark", false));
    expect(boot("light", true, options, [], true).cookie).toBe(
      schemeCookie(SCHEME_COOKIE, "light", true),
    );
  });

  test("is safe inside an inline <script>", () => {
    const script = schemeBootScript({
      storageKey: "</script><script>alert(1)</script>",
      cookie: "</script><script>alert(2)</script>",
    });
    expect(script).not.toContain("</script");
    expect(boot("dark", false, { storageKey: "</script>", cookie: "</script>" }).cookie).toBe(
      schemeCookie("</script>", "dark", false),
    );
  });
});

test("schemeCookie: a year on every path, secure in a secure context", () => {
  expect(schemeCookie("theme", "dark", false)).toBe(
    "theme=dark;path=/;max-age=31536000;samesite=lax",
  );
  expect(schemeCookie("__Host-theme", "light", true)).toBe(
    "__Host-theme=light;path=/;max-age=31536000;samesite=lax;secure",
  );
});

describe("schemeFromRequest", () => {
  test("reads the scheme cookie among the others", () => {
    expect(schemeFromRequest(`a=1; ${SCHEME_COOKIE}=dark; b=2`)).toBe("dark");
    expect(schemeFromRequest(`${SCHEME_COOKIE}=light`, '"dark"')).toBe("light");
    expect(schemeFromRequest("__Host-theme=dark", null, { cookie: "__Host-theme" })).toBe("dark");
    // Repeated Cookie fields, as the Fetch API's Headers joins them.
    expect(schemeFromRequest(`a=1, ${SCHEME_COOKIE}=dark`)).toBe("dark");
  });

  test("takes the last valid one: an old one on a page's path comes first", () => {
    expect(schemeFromRequest(`${SCHEME_COOKIE}=dark; a=1; ${SCHEME_COOKIE}=light`)).toBe("light");
    expect(schemeFromRequest(`${SCHEME_COOKIE}=dark; ${SCHEME_COOKIE}=junk`)).toBe("dark");
  });

  test("falls back to the browser's hint, quoted or not", () => {
    expect(schemeFromRequest(null, '"dark"')).toBe("dark");
    expect(schemeFromRequest("other=1", "light")).toBe("light");
    expect(schemeFromRequest(`${SCHEME_COOKIE}=purple`, '"dark"')).toBe("dark");
  });

  test("leaves the hint out for a fixed defaultMode, which a first visit draws", () => {
    expect(schemeFromRequest(null, '"dark"', { defaultMode: "light" })).toBeNull();
    expect(schemeFromRequest(null, '"light"', { defaultMode: "dark" })).toBeNull();
    expect(schemeFromRequest(`${SCHEME_COOKIE}=dark`, '"light"', { defaultMode: "light" })).toBe(
      "dark",
    );
  });

  test("is null without either", () => {
    expect(schemeFromRequest()).toBeNull();
    expect(schemeFromRequest("", "")).toBeNull();
    expect(
      schemeFromRequest(`x${SCHEME_COOKIE}=dark; ${SCHEME_COOKIE}`, '"no-preference"'),
    ).toBeNull();
  });
});
