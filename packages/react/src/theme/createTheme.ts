import {
  createDarkTheme,
  createLightTheme,
  webDarkTheme,
  webLightTheme,
  type Theme,
} from "@fluentui/react-components";
import { brandRamp, themeOverrides, type Scheme } from "@siiway/ui-core";

export interface CreateThemeOptions {
  scheme: Scheme;
  /** Brand colour, `#rgb` to `#rrggbbaa`. Missing or invalid gives Fluent's blue. */
  accent?: string | null;
}

/**
 * The SiiWay Fluent theme: Fluent's own theme for the accent's brand ramp,
 * with the neutral greys, radii and shadows replaced.
 */
export function createTheme({ scheme, accent }: CreateThemeOptions): Theme {
  const brand = brandRamp(accent);
  let base: Theme;
  try {
    base = scheme === "dark" ? createDarkTheme(brand) : createLightTheme(brand);
  } catch {
    base = scheme === "dark" ? webDarkTheme : webLightTheme;
  }
  return { ...base, ...themeOverrides(scheme) };
}
