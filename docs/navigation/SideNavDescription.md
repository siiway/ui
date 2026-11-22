A column of links: groups with quiet labels, an icon before each item if you
like, and items under items. The current page is grey, not the accent.

## Items

An item is `{ label, to?, icon?, active?, items? }`. Without `to`, it's a
heading for its `items`. Work out `active` from your router, for example
`!!useMatch(item.to)` in React Router; the current item gets
`aria-current="page"`.
