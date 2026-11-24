---
"@siiway/ui-core": minor
"@siiway/ui-react": minor
---

A server that renders each request can draw the person's light or dark scheme. `schemeBootScript({ cookie })` and `useThemeMode({ cookie })` keep the scheme in a cookie (`SCHEME_COOKIE` is a name for it), and `schemeFromRequest(cookieHeader, hint?, { cookie, defaultMode }?)` reads it back on the server, falling back to the `Sec-CH-Prefers-Color-Scheme` hint when `defaultMode` is `system`. `@siiway/ui-react` re-exports `SCHEME_COOKIE`, `schemeCookie` and `schemeFromRequest`. Pass that to `useThemeMode({ initialScheme })` on the server and the client: it draws that scheme until hydration ends, then follows the real one.
