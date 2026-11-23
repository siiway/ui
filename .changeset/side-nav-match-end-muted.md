---
"@siiway/ui-react": minor
---

`SideNav` finds the current page itself: an item without `active` asks the router's new, optional `useMatch` hook (`UiRouter.useMatch`, for React Router `(to, end) => useMatch({ path: to, end }) !== null`), and `end` keeps an item such as `/` from being current on the pages below it. A group with `placement: "end"` sits at the bottom of the nav, and a `muted` item is drawn grey at regular weight. `useUiMatch(to, end?)` asks the router from your own components.
