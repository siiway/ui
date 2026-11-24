import { SCHEME_COOKIE_ATTRIBUTES, THEME_STORAGE_KEY, type ThemeMode } from "./scheme.js";
import { CANVAS } from "./tokens/canvas.js";

export interface SchemeBootOptions {
  /** The `localStorage` key the choice is kept under; the same as `useThemeMode`'s. */
  storageKey?: string;
  /** When nothing valid is stored. Defaults to `system`. */
  defaultMode?: ThemeMode;
  /**
   * A cookie to write the scheme to, for the server to render in
   * (`schemeFromRequest`), such as `SCHEME_COOKIE`. Give `useThemeMode` the same.
   */
  cookie?: string;
}

// A value as a JavaScript literal that is safe inside an inline <script>.
function literal(value: string): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * JavaScript for an inline `<script>` in the page's `<head>`, after
 * `<meta name="theme-color">` if there is one. Before anything renders, it
 * reads the stored choice, resolves `system` with the OS setting, and draws
 * `<html>` in that scheme: `data-scheme`, `color-scheme`, the canvas
 * background and `--siiway-canvas`. Each `theme-color` takes the canvas.
 * Without it, a dark page is white until the app's JavaScript runs.
 * `<UiProvider page>` keeps `<html>` the same way afterwards. With `cookie`,
 * it also writes the scheme there, for the server to render the next request in.
 */
export function schemeBootScript({
  storageKey = THEME_STORAGE_KEY,
  defaultMode = "system",
  cookie,
}: SchemeBootOptions = {}): string {
  return [
    "(function(){",
    "var m;",
    `try{m=localStorage.getItem(${literal(storageKey)})}catch(e){}`,
    `if(m!=="system"&&m!=="light"&&m!=="dark")m=${literal(defaultMode)};`,
    'var s=m!=="system"?m:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";',
    "var r=document.documentElement;",
    `var c=s==="dark"?${literal(CANVAS.dark)}:${literal(CANVAS.light)};`,
    'r.setAttribute("data-scheme",s);',
    "r.style.colorScheme=s;",
    "r.style.backgroundColor=c;",
    'r.style.setProperty("--siiway-canvas",c);',
    `for(var t=document.querySelectorAll(${literal('meta[name="theme-color"]')}),i=0;i<t.length;i++)t[i].setAttribute("content",c);`,
    // As schemeCookie() writes it.
    cookie
      ? `try{document.cookie=${literal(`${cookie}=`)}+s+${literal(SCHEME_COOKIE_ATTRIBUTES)}+(self.isSecureContext?";secure":"")}catch(e){}`
      : "",
    "})();",
  ].join("");
}
