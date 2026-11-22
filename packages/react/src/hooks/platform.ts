import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function isApple() {
  return /Mac|iPhone|iPad/.test(navigator.platform);
}

function serverIsApple() {
  return false;
}

/**
 * Whether the reader is on an Apple device, where shortcuts use ⌘ rather than
 * Ctrl. The server can't tell, so it renders Ctrl, and the browser corrects
 * it without a hydration mismatch.
 */
export function useIsApple(): boolean {
  return useSyncExternalStore(subscribe, isApple, serverIsApple);
}
