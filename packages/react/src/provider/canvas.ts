// Tokens have no canvas (it's darker than colorNeutralBackground1 in dark),
// so this picks CANVAS by the provider's scheme.

import { makeStyles } from "@fluentui/react-components";
import { CANVAS } from "@siiway/ui-core";
import { useUiScheme } from "./context.js";

const useStyles = makeStyles({
  light: { backgroundColor: CANVAS.light },
  dark: { backgroundColor: CANVAS.dark },
});

/**
 * A class with the canvas colour, in the provider's scheme, for parts of the
 * page drawn on it that must be opaque: a sticky bar, a drawer, a full-page
 * message.
 */
export function useCanvasClass(): string {
  return useStyles()[useUiScheme()];
}
