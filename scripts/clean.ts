// Removes build output so the next build starts from nothing: each package's
// dist/ and tsbuildinfo, packed tarballs, release/ (scripts/release.ts) and
// the built Storybook.

import { rmSync } from "node:fs";
import { join } from "node:path";
import { Glob } from "bun";

const ROOT = join(import.meta.dir, "..");

for (const pattern of [
  "packages/*/dist",
  "packages/*/*.tsbuildinfo",
  "packages/*/*.tgz",
  "release",
  "storybook-static",
]) {
  for (const path of new Glob(pattern).scanSync({ cwd: ROOT, onlyFiles: false })) {
    rmSync(join(ROOT, path), { recursive: true, force: true });
  }
}
