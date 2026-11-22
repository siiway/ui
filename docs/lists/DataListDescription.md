A list with columns, lighter than a table: rows open a page or select
something, secondary columns hide on narrow screens, and a chevron marks rows
that lead somewhere. `ListSearch` goes above it and `Pagination` below.

`ListSearch` is a search box above a list, with filters or buttons beside it
as `children`. Pair it with
[`useDebouncedSearch`](?path=/docs/hooks-more-hooks--docs) to search as
people type.

`Pagination` shows previous and next, the page as "2 / 5", the total, and a
box to jump to a page. Its text comes from the
[library's strings](?path=/docs/guides-strings--docs).
