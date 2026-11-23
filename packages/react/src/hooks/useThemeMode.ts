// The person's light/dark choice and the scheme it draws in now. The choice is
// kept in localStorage under the key schemeBootScript reads, and follows
// other tabs; `system` follows the OS setting as it changes.
//
// On the server, and while hydrating, it gives `defaultMode`, drawn in
// `initialScheme` (what the server read from the scheme cookie) or light: the
// server can't see the stored choice or the OS. The client then moves to the
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
// Where the choice lives when the browser blocks localStorage.
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
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function serverStored() {
  return null;
}

function serverDark() {
  return false;
}

// True once the page is the client's: false on the server and while
// hydrating, where the server's scheme must be drawn.
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
   * light.
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
  const hydrated = useSyncExternalStore(subscribeNothing, clientTrue, serverFalse);
  const mode = isThemeMode(stored) ? stored : defaultMode;
  const live = resolveScheme(mode, dark);
  const scheme = hydrated || !initialScheme ? live : initialScheme;

  // Once the client knows the real scheme, and whenever it changes: the
  // choice, another tab's, or the OS setting.
  useEffect(() => {
    if (!cookie || !hydrated) return;
    try {
      document.cookie = schemeCookie(cookie, live, window.isSecureContext);
    } catch {
      // A sandboxed frame has no cookies.
    }
  }, [cookie, hydrated, live]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        memory.set(storageKey, next);
      }
      for (const listener of listeners) listener();
    },
    [storageKey],
  );

  return { mode, setMode, scheme };
}
