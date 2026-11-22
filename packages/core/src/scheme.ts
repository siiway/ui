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
