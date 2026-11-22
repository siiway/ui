# AGENTS

- Bun only, from the root. `bun run check` must pass before you finish.
- Commits: ASCII, conventional style. A change to a published package adds a
  changeset (`bun run changeset`). Never bump versions or publish by hand.

## Packages

- `packages/core`: no framework, no dependencies, no browser or Node globals.
- `packages/react`: the React + Fluent adapter. Its peers (`react`,
  `react-dom`, `@fluentui/react-components`, `@fluentui/react-icons`) never
  move to `dependencies`.
- Relative imports end in `.js`. `index.ts` has named exports only.

## Components

- Add one only when two apps need it or it defines the look.
- No data fetching and no router imports: data and callbacks come in as
  props; links and navigation go through `useUiLink()` / `useUiNavigate()`.
- Server-safe: no `window`, `document`, `localStorage` or `matchMedia` at
  module scope or during render.
- Only `<UiProvider page>` touches `<html>`/`<body>`; keep it in step with
  `schemeBootScript`.
- Headings, paragraphs and lists set their own margins (lists their padding):
  apps may have no CSS reset.
- Works on React 18.3: no `use()`, `ref` as a prop, or `<Context>` as a
  provider.
- No hardcoded English: visible text comes in as props; the library's own
  strings are in `core/src/i18n` (`en.ts` and `zh.ts`), read with
  `useUiStrings()`.

## Docs (Storybook)

- A behaviour change updates `docs/` in the same change.
- A component's page is generated from `docs/<group>/<Name>.stories.tsx` plus
  `<Name>Description.md`. Every prop gets a `/** */` comment in the source:
  that is the props table. Other components on the page go in the meta's
  `subcomponents`. A hook has no `component` and sets `docs.hideArgsTable`.
- Stories are example functions (`export const Default = () => …`), one per
  state, each but `Default` with a `docs.description.story`. Sample text goes
  through `useText(en, zh)`. Don't name a story after an imported component.
- Guides are MDX in `docs/guides/`, starting at `##`. Link pages as
  `[Theme](?path=/docs/guides-theme--docs)`.
- `.storybook/fluent/` is Fluent's addon code (MIT): keep changes there small
  and noted at the top of each file. Our styling goes in `.storybook/docs.css`.
- MDX and props-table errors only show in `bun run build-storybook`.
