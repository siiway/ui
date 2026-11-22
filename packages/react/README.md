# @siiway/ui-react

SiiWay's Fluent UI v9 theme, provider and components for React 18.3 and 19.

```bash
bun add @siiway/ui-react @siiway/ui-core
```

```tsx
import { UiProvider, PageHeader } from "@siiway/ui-react";

<UiProvider scheme="light" accent="#0078d4" locale="en">
  <PageHeader title="Applications" />
</UiProvider>;
```

`react`, `react-dom`, `@fluentui/react-components` and
`@fluentui/react-icons` are peer dependencies: the package uses your app's
copies. Documentation: https://ui.siiway.org

MIT licensed.
