A column of links: groups with quiet labels, an icon before each item if you
like, and items under items. The current page is grey, not the accent.

## Items

An item is `{ label, to?, icon?, active?, end?, muted?, items? }`. Without
`to`, it's a heading for its `items`. A `muted` item is grey, at regular
weight.

## The current page

Leave out `active` and the side nav asks your
[router](?path=/docs/guides-router--docs)'s `useMatch`: an item is current
on its path and the pages below it, so Apps stays current on an app's page.
Give `end` to `/`, which is above every page. An item with `items` has
`end` already: its pages are listed under it, and show themselves. Set
`active` to decide yourself: the router isn't asked about that item. The
current item gets `aria-current="page"`.

## Groups

A group is `{ label?, placement?, items }`. With `placement: "end"`, it sits
at the bottom of the nav, when the nav is taller than its groups: make it the
last group, and give the nav a height.
