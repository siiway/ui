Search in a dialog, opened from a `SearchButton` or with Ctrl K: a field,
grouped results and the keys to use them. ↑ and ↓ move, Enter opens, Esc
closes. You do the searching (what matches, how it's ranked, where a
result leads) and hand the palette the results.

## The query

Leave out `query` and the palette holds the field's text, emptying it each
time it opens; `onQueryChange` tells you the text to search with, including
the empty text of a new opening. Keep the palette mounted while it's closed,
so it fades out as it closes. Pass `query` to hold the text yourself, as
when picking a recent search fills it in, and clear it as you open the
palette to start a new search.

## Rows

Each group in `groups` lists its rows in `items`. A row (`CommandItem`) is:

| Field      | Type        | Notes                                                                                             |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `id`       | `string`    | Unique within the palette.                                                                        |
| `title`    | `ReactNode` | The row's text.                                                                                   |
| `subtitle` | `ReactNode` | One line: where it is, what matched.                                                              |
| `excerpt`  | `ReactNode` | Up to two lines: a passage of the page.                                                           |
| `icon`     | `ReactNode` | Shown before the text.                                                                            |
| `action`   | `ReactNode` | A button at the row's end, such as "Remove" on a recent search. Clicking it doesn't open the row. |
| `data`     | `T`         | Anything of yours, handed back with the row to `onSelect`: what the row stands for.               |

Wrap matched words in `<mark>` in the title or excerpt to highlight them.
`T`, the type of `data`, comes from `groups`; for rows of different kinds,
name it: `<CommandPalette<Page | Command> …>`.

The first row is the active one, each time the palette opens and as results
change, so Enter opens what's at the top. Moving the pointer over a row makes it active;
a pointer resting on the list doesn't take over from fresh results.

## useSearchShortcut

`useSearchShortcut(setOpen, { slash? })` makes Ctrl K (⌘K) toggle search
from anywhere on the page.

| Argument  | Type                                | Notes                                                                                           |
| --------- | ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| `setOpen` | `Dispatch<SetStateAction<boolean>>` | The setter of your `open` state.                                                                |
| `slash`   | `boolean`                           | With `true`, "/" opens search too, unless the reader is typing in a field. Defaults to `false`. |

```tsx
const [open, setOpen] = useState(false);
useSearchShortcut(setOpen);
```
