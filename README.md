# SiiWay UI

The shared look of SiiWay's apps: Fluent UI v9 with a flat neutral palette,
and the components the apps have in common.

- [`@siiway/ui-core`](./packages/core): design tokens, theme maths and the
  library's English and Chinese strings. No framework, no dependencies.
- [`@siiway/ui-react`](./packages/react): the theme, `<UiProvider>`, hooks and
  components for React and Fluent UI v9.

## Install

```bash
bun add @siiway/ui-react @siiway/ui-core
```

It uses your app's React (18.3 or 19), `@fluentui/react-components` and
`@fluentui/react-icons`.

```tsx
import { PageHeader, UiProvider } from "@siiway/ui-react";

<UiProvider scheme="dark" accent="#0078d4" locale="zh-CN">
  <PageHeader title="应用" />
</UiProvider>;
```

## Documentation

[ui.siiway.org](https://ui.siiway.org) covers setup, the theme, strings,
routing and every component, live.

## License

MIT. To work on the library, see [CONTRIBUTING.md](./.github/CONTRIBUTING.md).
