---
"@siiway/ui-react": minor
---

`DetailHeader` names the browser tab like `PageHeader`: it sends `tabTitle`, or the title when it is plain text, to `<UiProvider onPageTitle>`, and `null` when it unmounts.
