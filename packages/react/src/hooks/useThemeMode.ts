// The person's light/dark choice and the scheme it draws in now. The choice is
// kept in localStorage under the key schemeBootScript reads, and follows
// other tabs; `system` follows the OS setting as it changes.
//
// On the server, and while hydrating, it gives `defaultMode` drawn light: the
// server can't see the stored choice or the OS. The client then moves to the
// real scheme. useSyncExternalStore makes that switch without a hydration
// mismatch.

import {
  THEME_STORAGE_KEY,
  isThemeMode,
  resolveScheme,
  type Scheme,
  type ThemeMode,
} from "@siiway/ui-core";
import { useCallback, useSyncExternalStore } from "react";

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

export interface ThemeModeOptions {
  /** The `localStorage` key; give `schemeBootScript` the same. Defaults to `"siiway-theme"`. */
  storageKey?: string;
  /** Until a choice is stored, and on the server. Defaults to `"system"`. */
  defaultMode?: ThemeMode;
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
}: ThemeModeOptions = {}): ThemeModeState {
  const stored = useSyncExternalStore(subscribeMode, () => readStored(storageKey), serverStored);
  const dark = useSyncExternalStore(subscribeSystem, systemDark, serverDark);
  const mode = isThemeMode(stored) ? stored : defaultMode;

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

  return { mode, setMode, scheme: resolveScheme(mode, dark) };
}
