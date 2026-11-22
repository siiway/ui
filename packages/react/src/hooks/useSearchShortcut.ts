// The keys that open search, as Prism and Vellum both have them: Ctrl K (⌘K
// on Apple devices) toggles it from anywhere, and with `slash`, "/" opens it
// when the reader isn't typing.

import { useEffect, type Dispatch, type SetStateAction } from "react";

export interface SearchShortcutOptions {
  /** Also open on "/", as docs sites do. Defaults to false. */
  slash?: boolean;
}

function typing(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

/** Pass the state setter of the search's `open`, e.g. from `useState(false)`. */
export function useSearchShortcut(
  setOpen: Dispatch<SetStateAction<boolean>>,
  { slash = false }: SearchShortcutOptions = {},
): void {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // An input method's keys belong to the text it's composing.
      if (e.isComposing) return;
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      } else if (
        slash &&
        e.key === "/" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !typing(e.target)
      ) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen, slash]);
}
