---
"@siiway/ui-react": minor
---

`CommandPalette` can hold the search text itself: leave out `query` and it empties the field each time it opens, reporting the empty text through `onQueryChange`, which is now optional. A row (`CommandItem<T>`) takes `data`, which `onSelect` hands back with it, so you no longer need a lookup from `id` to what the row stands for.
