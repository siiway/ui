// The person's light/dark choice and the scheme it draws in now. The choice is
// kept in localStorage under the key schemeBootScript reads, and follows
// other tabs; `system` follows the OS setting as it changes.
//
// On the server, and while hydrating, it gives `defaultMode`, drawn in
// `initialScheme` (what the server read from the scheme cookie), or else as
// `defaultMode` draws without the OS (`system` light): the server can't see
// the stored choice or the OS. The client then moves to the
// real scheme. useSyncExternalStore makes that switch without a hydration
// mismatch. With `cookie`, it keeps the scheme cookie in step for the next
// request.

import {
  THEME_STORAGE_KEY,
  isThemeMode,
  resolveScheme,
  schemeCookie,
  type Scheme,
  type ThemeMode,
} from "@siiway/ui-core";
import { useCallback, useEffect, useSyncExternalStore } from "react";

const DARK_QUERY = "(prefers-color-scheme: dark)";

// setMode in this tab notifies these; other tabs arrive as `storage` events.
const listeners = new Set<() => void>();
// This tab's choice when localStorage wouldn't take it (blocked, or full). It
// wins over what's stored, other tabs' choices included, until a write gets
// through.
const memory = new Map<string, string>();

function subscribeMode(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function subscribeSystem(onChange: () => void) {
  const query = window.matchMedia?.(DARK_QUERY);
  query?.addEventListener("change", onChange);
  return () => query?.removeEventListener("change", onChange);
}

function systemDark() {
  return window.matchMedia?.(DARK_QUERY).matches ?? false;
}

function readStored(key: string): string | null {
  const own = memory.get(key);
  if (own !== undefined) return own;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

// The scheme the page draws, read afresh: while hydrating, the hook's own
// values are still the server's.
function currentScheme(storageKey: string, defaultMode: ThemeMode): Scheme {
  const stored = readStored(storageKey);
  return resolveScheme(isThemeMode(stored) ? stored : defaultMode, systemDark());
}

function serverStored() {
  return null;
}

function serverDark() {
  return false;
}

function writeCookie(name: string, scheme: Scheme) {
  try {
    document.cookie = schemeCookie(name, scheme, window.isSecureContext);
  } catch {
    // A sandboxed frame has no cookies.
  }
}

// True once the page is the client's: false on the server and while
// hydrating, where initialScheme must be drawn.
function subscribeNothing() {
  return () => {};
}

function clientTrue() {
  return true;
}

function serverFalse() {
  return false;
}

export interface ThemeModeOptions {
  /** The `localStorage` key; give `schemeBootScript` the same. Defaults to `"siiway-theme"`. */
  storageKey?: string;
  /** Until a choice is stored, and on the server. Defaults to `"system"`. */
  defaultMode?: ThemeMode;
  /**
   * A cookie to keep the scheme in, for the server to render the next
   * request in (`schemeFromRequest`), such as `SCHEME_COOKIE`. Give
   * `schemeBootScript` the same.
   */
  cookie?: string;
  /**
   * The scheme the server rendered in, on the server and again on the client:
   * drawn until hydration ends. `schemeFromRequest`'s answer; with null,
   * `defaultMode`'s scheme, light for `system`.
   */
  initialScheme?: Scheme | null;
}

export interface ThemeModeState {
  /** The choice, for `<ThemeSwitch value>`. */
  mode: ThemeMode;
  /** Stores a new choice, for `<ThemeSwitch onChange>`. */
  setMode: (mode: ThemeMode) => void;
  /** What to draw in now, for `<UiProvider scheme>`. */
  scheme: Scheme;
}

export function useThemeMode({
  storageKey = THEME_STORAGE_KEY,
  defaultMode = "system",
  cookie,
  initialScheme,
}: ThemeModeOptions = {}): ThemeModeState {
  const stored = useSyncExternalStore(subscribeMode, () => readStored(storageKey), serverStored);
  const dark = useSyncExternalStore(subscribeSystem, systemDark, serverDark);
  // Without initialScheme there's nothing to hold until hydration ends, so the
  // server's answer is the client's, and hydrating needs no second render.
  const hydrated = useSyncExternalStore(
    subscribeNothing,
    clientTrue,
    initialScheme ? serverFalse : clientTrue,
  );
  const mode = isThemeMode(stored) ? stored : defaultMode;
  const live = resolveScheme(mode, dark);
  const scheme = hydrated || !initialScheme ? live : initialScheme;

  // On load, and whenever the scheme changes: another tab's choice, or the
  // OS setting.
  useEffect(() => {
    if (cookie) writeCookie(cookie, currentScheme(storageKey, defaultMode));
  }, [cookie, storageKey, defaultMode, live]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      try {
        window.localStorage.setItem(storageKey, next);
        memory.delete(storageKey);
      } catch {
        memory.set(storageKey, next);
      }
      // At once, not in the effect: a page load right after must carry it.
      if (cookie) writeCookie(cookie, currentScheme(storageKey, defaultMode));
      for (const listener of listeners) listener();
    },
    [storageKey, cookie, defaultMode],
  );

  return { mode, setMode, scheme };
}
