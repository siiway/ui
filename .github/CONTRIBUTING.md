# Contributing

You need [Bun](https://bun.sh) 1.4. The rules the library follows are in
[AGENTS.md](../AGENTS.md).

| Command             | What it does                            |
| ------------------- | --------------------------------------- |
| `bun install`       | Installs everything                     |
| `bun run check`     | Typecheck, lint, format check and tests |
| `bun run storybook` | The docs on http://localhost:6006, live |

A change to a package needs a changeset for the changelog: run
`bun run changeset`. Pull requests run the same checks, and the Storybook
build.
