import { THEME_STORAGE_KEY, type ThemeMode } from "./scheme.js";
import { CANVAS } from "./tokens/canvas.js";

export interface SchemeBootOptions {
  /** The `localStorage` key the choice is kept under; the same as `useThemeMode`'s. */
  storageKey?: string;
  /** When nothing valid is stored. Defaults to `system`. */
  defaultMode?: ThemeMode;
}

// A value as a JavaScript literal that is safe inside an inline <script>.
function literal(value: string): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * JavaScript for an inline `<script>` at the top of the page's `<head>`. Before
 * anything renders, it reads the stored choice, resolves `system` with the
 * OS setting, and draws `<html>` in that scheme: `data-scheme`,
 * `color-scheme` and the canvas background. Without it, a dark page is white
 * until the app's JavaScript runs. `<UiProvider page>` keeps `<html>` the
 * same way afterwards.
 */
export function schemeBootScript({
  storageKey = THEME_STORAGE_KEY,
  defaultMode = "system",
}: SchemeBootOptions = {}): string {
  return [
    "(function(){",
    "var m;",
    `try{m=localStorage.getItem(${literal(storageKey)})}catch(e){}`,
    `if(m!=="system"&&m!=="light"&&m!=="dark")m=${literal(defaultMode)};`,
    'var s=m!=="system"?m:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";',
    "var r=document.documentElement;",
    'r.setAttribute("data-scheme",s);',
    "r.style.colorScheme=s;",
    `r.style.backgroundColor=s==="dark"?${literal(CANVAS.dark)}:${literal(CANVAS.light)};`,
    "})();",
  ].join("");
}
