// The page canvas as a class, for the parts of the page drawn on it that must
// be opaque: a sticky top bar, a full-page message. Tokens have no canvas
// (it's darker than colorNeutralBackground1 in dark), so this picks CANVAS by
// the provider's scheme.

import { makeStyles } from "@fluentui/react-components";
import { CANVAS } from "@siiway/ui-core";
import { useUiScheme } from "./context.js";

const useStyles = makeStyles({
  light: { backgroundColor: CANVAS.light },
  dark: { backgroundColor: CANVAS.dark },
});

export function useCanvasClass(): string {
  return useStyles()[useUiScheme()];
}
