/** A resolved colour scheme: what the page is drawn in right now. */
export type Scheme = "light" | "dark";

/** A person's colour-scheme choice: a fixed scheme, or follow the OS. */
export type ThemeMode = "system" | Scheme;

/** Where the choice is kept by default (`localStorage`), by `useThemeMode` and `schemeBootScript`. */
export const THEME_STORAGE_KEY = "siiway-theme";

/** Whether a value, such as one read back from storage, is a ThemeMode. */
export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

/** The scheme a mode draws in: `system` follows the OS. */
export function resolveScheme(mode: ThemeMode, systemDark: boolean): Scheme {
  if (mode !== "system") return mode;
  return systemDark ? "dark" : "light";
}

/** A name for the cookie that carries the scheme to the server, as `schemeFromRequest` reads it by default. */
export const SCHEME_COOKIE = "siiway-scheme";

// A year, on every path, and sent when someone follows a link from another site.
export const SCHEME_COOKIE_ATTRIBUTES = ";path=/;max-age=31536000;samesite=lax";

/**
 * The scheme cookie, as `document.cookie` takes it, the way `schemeBootScript`
 * and `useThemeMode` write it. `secure` (in a secure context) lets the name
 * start with `__Host-`.
 */
export function schemeCookie(name: string, scheme: Scheme, secure: boolean): string {
  return `${name}=${scheme}${SCHEME_COOKIE_ATTRIBUTES}${secure ? ";secure" : ""}`;
}

/**
 * The scheme to render a request in: the scheme cookie (named `cookie`) from
 * the `Cookie` header, else the browser's `Sec-CH-Prefers-Color-Scheme` hint,
 * else null, for your default.
 */
export function schemeFromRequest(
  cookieHeader?: string | null,
  prefersColorSchemeHint?: string | null,
  cookie: string = SCHEME_COOKIE,
): Scheme | null {
  for (const part of (cookieHeader ?? "").split(";")) {
    const at = part.indexOf("=");
    if (at < 0 || part.slice(0, at).trim() !== cookie) continue;
    const value = part.slice(at + 1).trim();
    if (value === "light" || value === "dark") return value;
  }
  // A structured header: the value comes quoted, as "dark".
  const hint = prefersColorSchemeHint?.trim().replace(/^"(.*)"$/, "$1");
  return hint === "light" || hint === "dark" ? hint : null;
}
