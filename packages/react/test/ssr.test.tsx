// Every component must render on the server: Prism and Vellum both
// pre-render. This renders each story of the gallery (docs/**/*.stories.tsx)
// on the server, in both schemes and both locales, the way an app's SSR
// entry renders its pages, and the components directly.

import { describe, expect, test } from "bun:test";
import {
  RendererProvider,
  SSRProvider,
  createDOMRenderer,
  renderToStyleElements,
} from "@fluentui/react-components";
import * as ui from "@siiway/ui-react";
import { UiProvider, type UiProviderProps, type UiRouter } from "@siiway/ui-react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType, ReactNode } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { StoryLocaleContext, type StoryLocale } from "../../../docs/helpers.js";

const DOCS = join(import.meta.dir, "../../../docs");

interface StoryModule {
  default: {
    title: string;
    component?: unknown;
    tags?: string[];
    parameters?: { docs?: { hideArgsTable?: boolean; description?: { component?: string } } };
  };
  [story: string]: unknown;
}

const storyFiles = [...new Bun.Glob("**/*.stories.tsx").scanSync(DOCS)].sort();
// Each story as a component, named by its title: "Search/CommandPalette Default".
const modules = await Promise.all(
  storyFiles.map(async (file) => [file, (await import(join(DOCS, file))) as StoryModule] as const),
);
const stories = modules.flatMap(([, mod]) =>
  Object.entries(mod)
    .filter(([name, story]) => name !== "default" && typeof story === "function")
    .map(([name, story]) => {
      // A story is its example function, as Fluent writes them.
      const Story = story as ComponentType & { storyName?: string };
      return [`${mod.default.title} ${Story.storyName ?? name}`, Story] as const;
    }),
);

function renderHtml(node: ReactNode) {
  const renderer = createDOMRenderer();
  const html = renderToString(
    <RendererProvider renderer={renderer}>
      <SSRProvider>{node}</SSRProvider>
    </RendererProvider>,
  );
  return { html, styles: renderToStyleElements(renderer) };
}

function render(node: ReactNode, props: Omit<UiProviderProps, "children">) {
  return renderHtml(<UiProvider {...props}>{node}</UiProvider>);
}

// A story as the gallery shows it: in a provider following the toolbar.
function renderStory(Story: ComponentType, scheme: "light" | "dark", locale: StoryLocale) {
  return render(
    <StoryLocaleContext.Provider value={locale}>
      <Story />
    </StoryLocaleContext.Provider>,
    { scheme, locale },
  );
}

describe.each(["light", "dark"] as const)("%s", (scheme) => {
  describe.each(["en", "zh"] as const)("%s", (locale) => {
    test.each(stories)("%s", (_, Story) => {
      const { html, styles } = renderStory(Story, scheme, locale);
      expect(html.length).toBeGreaterThan(0);
      expect(styles.length).toBeGreaterThan(0);
    });
  });
});

test("the stories follow the toolbar's language", () => {
  const DataList = stories.find(([name]) => name === "Lists and data/DataList Default")![1];
  expect(renderStory(DataList, "light", "zh").html).toContain("上一页");
  expect(renderStory(DataList, "light", "en").html).toContain("Previous");
});

// Headings, paragraphs and lists get margins (and lists an indent) from the
// browser. Prism resets every element, but an app may not (Vellum doesn't),
// so a component that renders one sets its own.
const SPACED = /<(h[1-6]|p|ul|ol|dl|pre|figure|blockquote)\b([^>]*)>/g;

function declares(props: Set<string>, box: "margin" | "padding", side: "top" | "bottom" | "left") {
  const axis = side === "left" ? "inline" : "block";
  const logical = { top: "block-start", bottom: "block-end", left: "inline-start" }[side];
  return [box, `${box}-${side}`, `${box}-${axis}`, `${box}-${logical}`].some((p) => props.has(p));
}

test.each(stories)("%s doesn't depend on the app's CSS reset", (_, Story) => {
  const { html, styles } = renderStory(Story, "light", "en");
  // The properties each class sets, from the CSS Griffel collected.
  const byClass = new Map<string, string[]>();
  const css = renderToStaticMarkup(<>{styles}</>);
  for (const [, name, body] of css.matchAll(/\.([\w-]+)\{([^}]*)\}/g)) {
    const props = body!.split(";").map((decl) => decl.split(":")[0]!.trim());
    byClass.set(name!, [...(byClass.get(name!) ?? []), ...props]);
  }
  const unset: string[] = [];
  for (const [element, tag, attrs] of html.matchAll(SPACED)) {
    const classes = /class="([^"]*)"/.exec(attrs!)?.[1]?.split(" ") ?? [];
    const props = new Set(classes.flatMap((name) => byClass.get(name) ?? []));
    const ok =
      declares(props, "margin", "top") &&
      declares(props, "margin", "bottom") &&
      (!/^[uo]l$/.test(tag!) || declares(props, "padding", "left"));
    if (!ok) unset.push(element);
  }
  expect(unset).toEqual([]);
});

test("every exported component has a story in the gallery", () => {
  const source = storyFiles.map((file) => readFileSync(join(DOCS, file), "utf8")).join("\n");
  const missing = Object.entries(ui)
    .filter(([name, value]) => typeof value === "function" && /^[A-Z]/.test(name))
    .map(([name]) => name)
    .filter((name) => !["UiProvider", "UiLink"].includes(name))
    .filter((name) => !source.includes(`<${name}`));
  expect(missing).toEqual([]);
});

// Storybook makes each stories file a docs page, as Fluent's are: the
// description from its .md, then the stories, then the component's props
// (none for a hook). A guide's stories (`!autodocs`) show on its MDX page.
test("every stories file makes a docs page", () => {
  const incomplete = modules
    .filter(([, { default: meta }]) => !meta.tags?.includes("!autodocs"))
    .filter(([, { default: meta }]) => {
      const description = meta.parameters?.docs?.description?.component?.trim();
      const props = meta.component !== undefined || meta.parameters?.docs?.hideArgsTable === true;
      return !description || !props;
    })
    .map(([file]) => file);
  expect(incomplete).toEqual([]);
});

test("library strings follow the locale", () => {
  const field = <ui.DurationInput value={30} unit="days" onChange={() => {}} />;
  expect(render(field, { scheme: "light", locale: "zh-CN" }).html).toContain("30 天");
  expect(render(field, { scheme: "light", locale: "en" }).html).toContain("30 days");

  const pager = <ui.Pagination page={2} total={87} pageSize={20} onChange={() => {}} />;
  expect(render(pager, { scheme: "light", locale: "zh-CN" }).html).toContain("上一页");
  expect(render(pager, { scheme: "light", locale: "en-US" }).html).toContain("Previous");
  expect(
    render(pager, { scheme: "light", locale: "en", strings: { previous: "Back" } }).html,
  ).toContain("Back");
});

test("links go through the app's router", () => {
  const router: UiRouter = {
    Link: ({ to, state: _state, ...rest }) => <a data-app-router href={`/app${to}`} {...rest} />,
    useNavigate: () => () => {},
  };
  const { html } = render(<ui.SettingsLinkRow to="/scopes" label="Scopes" />, {
    scheme: "light",
    router,
  });
  expect(html).toContain("data-app-router");
  expect(html).toContain('href="/app/scopes"');
});

test("without a router, links are plain anchors", () => {
  const { html } = render(<ui.SettingsLinkRow to="/scopes" label="Scopes" />, {
    scheme: "light",
  });
  expect(html).toContain('href="/scopes"');
});

// The body's margin is a Griffel static style, which Griffel leaves out when
// NODE_ENV is "test", as under `bun test`: a browser has to check that part.
test("a page provider takes the canvas", () => {
  const page = render(<p>Hi</p>, { scheme: "dark", page: true });
  expect(page.html).toContain(`background-color:${ui.CANVAS.dark}`);

  // A nested provider (a preview, a demo) leaves the page alone.
  const nested = render(<p>Hi</p>, { scheme: "dark" });
  expect(nested.html).not.toContain(`background-color:${ui.CANVAS.dark}`);

  // The app's own style still wins.
  const own = render(<p>Hi</p>, { scheme: "dark", page: true, style: { backgroundColor: "red" } });
  expect(own.html).toContain("background-color:red");
});

test("useThemeMode renders the default mode, drawn light, on the server", () => {
  function Probe(options: ui.ThemeModeOptions) {
    const { mode, scheme } = ui.useThemeMode(options);
    return <p>{`${mode}/${scheme}`}</p>;
  }
  expect(renderToString(<Probe />)).toContain("system/light");
  expect(renderToString(<Probe defaultMode="dark" />)).toContain("dark/dark");
});

test("the top bar's menu button can come before the brand", () => {
  const bar = (props: Partial<ui.TopBarProps>) =>
    render(<ui.TopBar brand={{ label: "Prism", to: "/" }} onMenu={() => {}} {...props} />, {
      scheme: "light",
      locale: "en",
    }).html;
  const end = bar({});
  expect(end.indexOf("Open navigation")).toBeGreaterThan(end.indexOf("Prism"));
  const start = bar({ menuPosition: "start", menuBelow: 768 });
  expect(start.indexOf("Open navigation")).toBeGreaterThan(-1);
  expect(start.indexOf("Open navigation")).toBeLessThan(start.indexOf("Prism"));
});

test("buttons that open a page are links through the app's router", () => {
  const router: UiRouter = {
    Link: ({ to, state: _state, ...rest }) => <a data-app-router href={`/app${to}`} {...rest} />,
    useNavigate: () => () => {},
  };
  const back = render(<ui.BackButton to="/apps">Apps</ui.BackButton>, { scheme: "light", router });
  expect(back.html).toMatch(/<a [^>]*href="\/app\/apps"[^>]*class="fui-Button /);

  const status = render(
    <ui.StatusPage
      mark="404"
      title="Not found"
      description="Gone."
      back="Go back"
      secondary={[{ label: "Search", to: "/search" }]}
      primary={{ label: "Home", to: "/" }}
    />,
    { scheme: "light", router },
  );
  expect(status.html).toContain('href="/app/search"');
  expect(status.html).toContain('href="/app/"');
  // Going back has no address of its own: it stays a button.
  expect(status.html).toMatch(/<button[^>]*>Go back<\/button>/);
});
