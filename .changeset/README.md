# Changesets

A change to a published package adds a changeset: run `bun run changeset`,
pick the bump, and describe the change for the people who use the package.
Both packages share one version, so a bump to either bumps both.

Releases run in the Release workflow (`.github/workflows/release.yml`): it
turns the changesets on `main` into a "chore: release" PR, and merging that
PR publishes. See "Releasing" in the README.
