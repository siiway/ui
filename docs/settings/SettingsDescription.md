Settings and detail pages are a column of cards. Each card has a header and
rows: a label with an optional icon and description on the left, the control
on the right. On narrow screens the control moves under its label.

Rows go straight in the card, each with a divider above it. A
`SettingsLinkRow` opens another page, such as one app in a list, and takes an
avatar as its icon. For anything that isn't a row, such as a form or an
editor, use `SettingsBody`: a padded block under the header.

`SaveFooter` holds a card's Discard and Save buttons. `SettingsToast` shows
how the save went: pair it with
[`useToastMessage`](?path=/docs/hooks-usetoastmessage--docs).

## Tables, empty cards and footers

- `SettingsTable` holds a Fluent `Table` edge to edge with the card's padding.
- `SettingsEmpty` says "Nothing here" inside a card.
- `SettingsFooter` is the card's bottom bar: buttons, and a note on the left.
  A [`Pagination`](?path=/docs/lists-and-data-datalist--docs) with `footer`
  sits in one.

While a settings page loads, show
[`SkeletonSettingsPage`](?path=/docs/lists-and-data-skeletons--docs).
