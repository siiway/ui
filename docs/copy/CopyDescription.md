Three ways to copy a value, each confirming with a "Copied!" tooltip. That
text and "Copy failed" come from the
[library's strings](?path=/docs/guides-strings--docs).

- `CopyButton`: an icon button that copies `text`.
- `CopyIdTrigger`: makes its children copy an ID on click, such as a name in a
  header or a cell.
- `CopyIdText`: an ID in monospace with a copy icon, copied on click.

To copy from your own components, use
[`useCopy`](?path=/docs/hooks-more-hooks--docs).
