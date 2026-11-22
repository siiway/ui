// Builds a release for the Release workflow (.github/workflows/release.yml) to
// publish, in release/. It has no access to npm or GitHub: the workflow's
// publish job does, and runs none of this repository's code.
//
// - Only packages whose version isn't on npm yet go in. On an ordinary push
//   that's none, and it stops before building.
// - It builds and checks from nothing first (clean, check), then Bun packs
//   each package, which replaces `workspace:*` with the real version.
// - release/packages lists the tarballs in publishing order, core first so
//   react's dependency on it resolves, one `<name> <version> <file>` a line.
// - release/notes.md is the GitHub release's text: this version's sections
//   of the changelogs.
// - In GitHub Actions it writes `pending` and `version` to the step's outputs.

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const OUT = join(ROOT, "release");

const packages = ["core", "react"].map((dir) => {
  const cwd = join(ROOT, "packages", dir);
  const { name, version } = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8")) as {
    name: string;
    version: string;
  };
  return { cwd, name, version };
});
const version = packages[0]!.version;
if (packages.some((pkg) => pkg.version !== version)) {
  throw new Error(`versions differ: ${packages.map((p) => `${p.name}@${p.version}`).join(", ")}`);
}

function run(cmd: string[], cwd = ROOT) {
  const result = Bun.spawnSync(cmd, { cwd, stdout: "inherit", stderr: "inherit" });
  if (result.exitCode !== 0) process.exit(result.exitCode ?? 1);
}

function output(values: Record<string, string>) {
  const file = process.env.GITHUB_OUTPUT;
  if (!file) return;
  for (const [key, value] of Object.entries(values)) appendFileSync(file, `${key}=${value}\n`);
}

function onNpm(name: string) {
  const view = Bun.spawnSync(["npm", "view", `${name}@${version}`, "version"], { cwd: ROOT });
  return view.exitCode === 0 && view.stdout.toString().trim() === version;
}

function releaseNotes() {
  const heading = `\n## ${version}\n`;
  const sections = packages.flatMap(({ cwd, name }) => {
    const file = join(cwd, "CHANGELOG.md");
    if (!existsSync(file)) return [];
    const text = readFileSync(file, "utf8");
    const start = text.indexOf(heading);
    if (start < 0) return [];
    const rest = text.slice(start + heading.length);
    const end = rest.search(/\n## /);
    const changes = (end < 0 ? rest : rest.slice(0, end)).trim();
    // The fixed group bumps a package that didn't change with an empty section.
    return changes ? [`## ${name}\n\n${changes}`] : [];
  });
  return `${sections.join("\n\n") || "First release."}\n`;
}

const pending = packages.filter(({ name }) => !onNpm(name));
if (pending.length === 0) {
  console.log(`${version} is on npm already: nothing to release`);
  output({ pending: "false", version });
  process.exit(0);
}

run(["bun", "run", "clean"]);
run(["bun", "run", "check"]);

mkdirSync(OUT);
const lines = pending.map(({ cwd, name }) => {
  const pack = Bun.spawnSync(["bun", "pm", "pack", "--quiet", "--destination", OUT], {
    cwd,
    stderr: "inherit",
  });
  if (pack.exitCode !== 0) process.exit(pack.exitCode ?? 1);
  // --quiet prints only the tarball's path.
  const tarball = basename(pack.stdout.toString().trim().split("\n").pop()!.trim());
  return `${name} ${version} ${tarball}`;
});
writeFileSync(join(OUT, "packages"), `${lines.join("\n")}\n`);
writeFileSync(join(OUT, "notes.md"), releaseNotes());
console.log(`Packed ${pending.map(({ name }) => `${name}@${version}`).join(", ")} into release/`);
output({ pending: "true", version });
