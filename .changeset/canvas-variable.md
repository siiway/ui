---
"@siiway/ui-core": minor
"@siiway/ui-react": minor
---

The canvas colour reaches the app's CSS and the browser's bar. `schemeBootScript()` and `<UiProvider page>` set `--siiway-canvas` on `<html>`, and each `<meta name="theme-color">` to the canvas. `useCanvasClass()` is exported, for Griffel styles. Put the boot script after the `theme-color` meta, so it can set it.
