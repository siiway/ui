# @siiway/ui-react

## 0.2.0

### Minor Changes

- 08ca761: The canvas colour reaches the app's CSS and the browser's bar. `schemeBootScript()` and `<UiProvider page>` set `--siiway-canvas` on `<html>`, and each `<meta name="theme-color">` to the canvas. `useCanvasClass()` is exported, for Griffel styles. Put the boot script after the `theme-color` meta, so it can set it.
- 14d38e5: `CommandPalette` can hold the search text itself: leave out `query` and it empties the field each time it opens, reporting the empty text through `onQueryChange`. A row (`CommandItem<T>`) takes `data`, which `onSelect` hands back with it, so you no longer need a lookup from `id` to what the row stands for. Each opening makes the top row active.
- df04309: `DetailHeader` names the browser tab like `PageHeader`: it sends `tabTitle`, or the title when it is plain text, to `<UiProvider onPageTitle>`, and `null` when it unmounts.
- d6f6fe8: `UiProvider` adds the look's global rules, which apps used to copy into their own CSS: floating surfaces (dialogs, menus, popovers, dropdown lists) get a hairline border, and badges don't wrap. With `page`, selected text takes a tint of the accent and scrollbars are thin, with a neutral thumb.
- 53e99d4: `BackButton` and `StatusPage`'s main and secondary actions are links drawn as buttons, through the app's router, so they open in a new tab on a middle-click and read as links. They were buttons that navigated on click.
- 4d36c4b: `SideNav` finds the current page itself: an item without `active` asks the router's new, optional `useMatch` hook (`UiRouter.useMatch`, for React Router `(to, end) => useMatch({ path: to, end }) !== null`); one with `active` doesn't, and `end` keeps an item such as `/` from being current on the pages below it. An item with `items` has `end` unless it says otherwise, since its pages are listed under it. A group with `placement: "end"` sits at the bottom of the nav, and a `muted` item is drawn grey at regular weight. `useUiMatch(to, end?)` asks the router from your own components.
- a36ba61: A server that renders each request can draw the person's light or dark scheme. `schemeBootScript({ cookie })` and `useThemeMode({ cookie })` keep the scheme in a cookie (`SCHEME_COOKIE` is a name for it), and `schemeFromRequest(cookieHeader, hint?, { cookie, defaultMode }?)` reads it back on the server, falling back to the `Sec-CH-Prefers-Color-Scheme` hint when `defaultMode` is `system`. `@siiway/ui-react` re-exports `SCHEME_COOKIE`, `schemeCookie` and `schemeFromRequest`. Pass that to `useThemeMode({ initialScheme })` on the server and the client: it draws that scheme until hydration ends, then follows the real one.
- 134aaa5: `TopBar` takes `menuPosition` (`"end"`, the default, or `"start"`, before the brand) and `menuBelow` (`960`, the default, or `768`), the width its menu button shows from, to match where the app's navigation becomes a drawer.

### Patch Changes

- 9c048d6: A page header that unmounts after the next page's header has mounted, as in a route transition, no longer clears the next page's tab title.
- 80cb2c5: `PasswordInput` hides Edge's own reveal and clear buttons, which showed beside its toggle.
- Updated dependencies [08ca761]
- Updated dependencies [a36ba61]
  - @siiway/ui-core@0.2.0
