Search in a dialog, opened from a `SearchButton` or with Ctrl K: a field,
grouped results and the keys to use them. ↑ and ↓ move, Enter opens, Esc
closes. You do the searching (what matches, how it's ranked, where a
result leads) and hand the palette the results.

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

Wrap matched words in `<mark>` in the title or excerpt to highlight them.

The first row is the active one, and stays so as results change, so Enter
opens what's at the top. Moving the pointer over a row makes it active;
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
