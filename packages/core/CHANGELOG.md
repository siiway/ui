# @siiway/ui-core

## 0.2.0

### Minor Changes

- 08ca761: The canvas colour reaches the app's CSS and the browser's bar. `schemeBootScript()` and `<UiProvider page>` set `--siiway-canvas` on `<html>`, and each `<meta name="theme-color">` to the canvas. `useCanvasClass()` is exported, for Griffel styles. Put the boot script after the `theme-color` meta, so it can set it.
- a36ba61: A server that renders each request can draw the person's light or dark scheme. `schemeBootScript({ cookie })` and `useThemeMode({ cookie })` keep the scheme in a cookie (`SCHEME_COOKIE` is a name for it), and `schemeFromRequest(cookieHeader, hint?, { cookie, defaultMode }?)` reads it back on the server, falling back to the `Sec-CH-Prefers-Color-Scheme` hint when `defaultMode` is `system`. `@siiway/ui-react` re-exports `SCHEME_COOKIE`, `schemeCookie` and `schemeFromRequest`. Pass that to `useThemeMode({ initialScheme })` on the server and the client: it draws that scheme until hydration ends, then follows the real one.
