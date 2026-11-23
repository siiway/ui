The strip across the top of the page: your brand, a crumb after it, a few
links, and your actions at the end.

The actions are its `children`: a
[`SearchButton`](?path=/docs/search-searchbutton--docs), a
[`ThemeMenu`](?path=/docs/inputs-thememenu--docs), icon buttons.

## Narrow screens

On a narrow screen it gives way in steps. From 960px down, the menu button
shows (when you pass `onMenu`) to open your navigation in a drawer; at 720px
the links go, and at 540px the crumb.

If your navigation becomes a drawer at 768px instead, `menuBelow={768}`
shows the button from there. `menuPosition="start"` puts it before the brand,
as phone headers often have it.

## Height

`TOP_BAR_HEIGHT` is its height, 52 pixels: what sticks below the bar (a
sidebar, an outline) sits that far down.
