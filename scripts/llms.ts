// The built Storybook's pages as text, for LLMs and "Copy Page" (`bun run
// llms`, after `bun run build-storybook`): llms.txt lists them and
// llms/<id>.txt holds each. Fluent's extractor reads the stories and writes
// the component pages; this script also:
// - reads each guide (MDX) once its code blocks have rendered, without the
//   live examples, which read as stray words;
// - keeps the guide when it shares an id with the stories it shows;
// - points links to other pages at their text;
// - gives each component its whole first paragraph in llms.txt, by section;
// - puts a note in the front page, empty until its JavaScript runs, that
//   points to llms.txt.

import {
  convertHtmlToMarkdown,
  extractStorybookData,
  generateFullFileContentFromStory,
} from "@fluentui/storybook-llms-extractor/dist/src/utils.js";
import type { StorybookStoreItem } from "@fluentui/storybook-llms-extractor/dist/src/types.js";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE = "https://ui.siiway.org";
const TITLE = "SiiWay UI";
const SUMMARY = "The look of SiiWay's apps: design tokens, a Fluent UI theme and React components.";
const DIST = join(import.meta.dir, "..", "storybook-static");

const isGuide = (item: StorybookStoreItem) => item.meta.parameters.fileName.endsWith(".mdx");
const url = (id: string) => `${BASE}/llms/${id}.txt`;
const linkPages = (text: string) =>
  text.replace(
    /\]\(\?path=\/docs\/([\w-]+)--docs(#[\w-]*)?\)/g,
    (_, id: string) => `](${url(id)})`,
  );

const data = await extractStorybookData({ distPath: DIST, summaryBaseUrl: BASE });
const pages = data.filter(
  (item) =>
    isGuide(item) || !data.some((other) => other.meta.id === item.meta.id && isGuide(other)),
);

// The guides, rendered from the build.
const server = Bun.serve({
  port: 0,
  async fetch(request) {
    const file = Bun.file(join(DIST, new URL(request.url).pathname));
    return (await file.exists()) ? new Response(file) : new Response(null, { status: 404 });
  },
});
const browser = await chromium.launch();
const tab = await browser.newPage();
const guides = new Map<string, string>();
for (const { meta } of pages.filter(isGuide)) {
  await tab.goto(`${server.url}iframe.html?id=${meta.id}--docs&viewMode=docs`, {
    waitUntil: "networkidle",
  });
  const html = await tab.locator(".sbdocs-content").evaluate((content) => {
    const page = content.cloneNode(true) as HTMLElement;
    for (const example of page.querySelectorAll(".sbdocs-preview")) example.remove();
    // Plain code: the highlighter's markup loses blank lines.
    for (const block of page.querySelectorAll("pre:has(> .docblock-source)")) {
      const code = block.querySelector(".prismjs");
      const plain = document.createElement("pre");
      plain.append(document.createElement("code"));
      plain.firstElementChild!.className =
        code?.querySelector("[class*=language-]")?.className ?? "";
      plain.firstElementChild!.textContent = code?.textContent ?? "";
      block.replaceWith(plain);
    }
    // Links within the page keep their text; the extractor drops them.
    for (const link of page.querySelectorAll("a[href^='#']:not(:is(h1, h2, h3, h4, h5, h6) a)")) {
      link.replaceWith(...link.childNodes);
    }
    for (const version of page.querySelectorAll(".fluent-version")) version.before(" ");
    return page.innerHTML;
  });
  // Without the blank lines the examples leave behind.
  const text = await convertHtmlToMarkdown(html);
  guides.set(meta.id, text.replace(/\n[^\S\n]+(?=\n)/g, "\n").replace(/\n{3,}/g, "\n\n"));
}
await browser.close();
await server.stop();

await rm(join(DIST, "llms"), { recursive: true, force: true });
await mkdir(join(DIST, "llms"));
for (const page of pages) {
  const text = guides.get(page.meta.id) ?? generateFullFileContentFromStory(page).join("\n");
  await Bun.write(join(DIST, "llms", `${page.meta.id}.txt`), linkPages(text));
}

// llms.txt, as https://llmstxt.org lays it out.
const sections = new Map<string, string[]>();
for (const { meta } of pages) {
  const [section, ...name] = meta.title.split("/");
  const key = name.length ? section! : "";
  const about = meta.parameters.docs?.description?.component?.trim().split(/\n\s*\n/)[0];
  const item = `- [${name.join("/") || section}](${url(meta.id)})`;
  const line = about ? `${item}: ${about.replace(/\s+/g, " ")}` : item;
  sections.set(key, [...(sections.get(key) ?? []), linkPages(line)]);
}
const summary = [`# ${TITLE}`, "", `> ${SUMMARY}`, ""];
for (const [section, items] of sections) {
  summary.push(...(section ? [`## ${section}`, ""] : []), ...items, "");
}
await Bun.write(join(DIST, "llms.txt"), summary.join("\n"));

// The front page. #root is emptied when the Storybook mounts; the note is
// hidden so it doesn't flash.
const INDEX = join(DIST, "index.html");
const HIDDEN = "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)";
const NOTE =
  `<p style="${HIDDEN}">${TITLE}'s documentation as text: <a href="llms.txt">llms.txt</a> ` +
  "lists every page. A page at <code>?path=/docs/&lt;id&gt;--docs</code> is at " +
  "<code>llms/&lt;id&gt;.txt</code>.</p>";
const LINK = '<link rel="alternate" type="text/plain" href="llms.txt" title="llms.txt" />';
const ROOT = '<div id="root"></div>';
let index = await Bun.file(INDEX).text();
if (!index.includes(NOTE)) {
  if (!index.includes(ROOT)) throw new Error(`${INDEX} has no empty ${ROOT}.`);
  index = index.replace(ROOT, `<div id="root">${NOTE}</div>`);
}
if (!index.includes(LINK)) index = index.replace("</head>", `${LINK}\n</head>`);
await Bun.write(INDEX, index);
