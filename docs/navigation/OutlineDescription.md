The headings of the page, beside it. The one being read is marked as the page
scrolls, and a click scrolls to it and puts it in the URL's hash. The examples
below list this page's sections: scroll, or pick one.

## Keeping it in view

Make it sticky and let it scroll on its own; it keeps the marked heading in
sight within itself:

```tsx
const useStyles = makeStyles({
  outline: {
    position: "sticky",
    top: `${TOP_BAR_HEIGHT}px`,
    maxHeight: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
    overflowY: "auto",
    padding: "32px 20px 24px 16px",
  },
});
```
