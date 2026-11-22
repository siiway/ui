// The menus at the top of a docs page (Fluent's theme picker, and ours for
// the language and the direction) set Storybook globals. The docs container
// needs them too, to put the whole page in the picked scheme, so they are kept
// here as they change. The decorator reports them as well, for a page opened
// with them already set (`?globals=siiway_theme:dark`).

import { useSyncExternalStore } from "react";
import { addons } from "storybook/preview-api";
import { DIR_ID, LOCALE_ID, THEME_ID } from "./fluent/constants";
import { systemScheme } from "./theme";

export interface StoryGlobals {
  scheme: "light" | "dark";
  locale: "en" | "zh";
  dir: "ltr" | "rtl";
}

/** Storybook's globals, read as ours. */
export function readGlobals(globals: Record<string, unknown>): StoryGlobals {
  return {
    scheme: globals[THEME_ID] === "dark" ? "dark" : "light",
    locale: globals[LOCALE_ID] === "zh" ? "zh" : "en",
    dir: globals[DIR_ID] === "rtl" ? "rtl" : "ltr",
  };
}

// A first visit follows the OS; the theme picker takes over from there.
export const INITIAL_GLOBALS = {
  [THEME_ID]: systemScheme(),
  [LOCALE_ID]: "en",
  [DIR_ID]: "ltr",
};

let current: StoryGlobals = readGlobals(INITIAL_GLOBALS);
const listeners = new Set<() => void>();

export function noteGlobals(globals: Record<string, unknown>) {
  const next = readGlobals(globals);
  if (next.scheme === current.scheme && next.locale === current.locale && next.dir === current.dir)
    return;
  current = next;
  for (const listener of listeners) listener();
}

try {
  const channel = addons.getChannel();
  const take = ({ globals }: { globals: Record<string, unknown> }) => noteGlobals(globals);
  channel.on("setGlobals", take);
  channel.on("globalsUpdated", take);
} catch {
  // No channel (a test, say): the defaults stand.
}

export function useStoryGlobals(): StoryGlobals {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
  );
}
