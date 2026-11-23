// The Storybook as Fluent UI's own (storybooks.fluentui.dev/react): the
// previews of microsoft/fluentui (.storybook/preview.js,
// apps/public-docsite-v9/.storybook/preview.js) and of their Storybook addon,
// copied in ./fluent (its preset: decorators, the docs container and page).
// The one swap: the library's <UiProvider> where Fluent has FluentProvider,
// following the menus at the top of each page: the theme (light or dark), the language (the
// library's strings and the stories' sample text) and the direction.

import "./fluent/styles.css";
import "./docs.css";
import { tokens } from "@fluentui/react-components";
import { UiProvider, type UiLinkProps, type UiRouter } from "@siiway/ui-react";
import type { Decorator, Preview } from "@storybook/react-vite";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { StoryLocaleContext } from "../docs/helpers";
import { withAriaLive } from "./fluent/decorators/withAriaLive";
import { FluentDocsContainer } from "./fluent/docs/FluentDocsContainer";
import { FluentDocsPage } from "./fluent/docs/FluentDocsPage";
import type { FluentParameters } from "./fluent/hooks";
import { INITIAL_GLOBALS, noteGlobals, readGlobals } from "./globals";

// Links and navigation in a story stay where they are: they'd lead to the
// demo app's own pages. A plain click moves the story's own location instead
// (`parameters.location`, "/" at first), which useMatch reads, so a SideNav's
// current item follows the clicks. Each story starts at its own.
const StoryLocation = createContext({ path: "/", go: (_to: string) => {} });

function StoryLocationProvider({ initial, children }: { initial: string; children: ReactNode }) {
  const [path, go] = useState(initial);
  const value = useMemo(() => ({ path, go }), [path]);
  return <StoryLocation.Provider value={value}>{children}</StoryLocation.Provider>;
}

function StoryLink({ to, state: _state, onClick, ...rest }: UiLinkProps) {
  const { go } = useContext(StoryLocation);
  return (
    <a
      href={to}
      onClick={(e) => {
        try {
          onClick?.(e);
          // Not when the link's own handler cancelled the click, nor for a
          // click meant for a new tab or window.
          const plain = !(e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
          if (plain && !e.defaultPrevented) go(to);
        } finally {
          e.preventDefault();
        }
      }}
      // A middle-click, which opens a new tab.
      onAuxClick={(e) => e.preventDefault()}
      {...rest}
    />
  );
}

// React Router's matching, for plain paths: "/apps" matches "/apps/1" too,
// unless `end`.
function useStoryMatch(to: string, end: boolean) {
  const { path } = useContext(StoryLocation);
  const base = to.replace(/\/+$/, "");
  if (path.replace(/\/+$/, "") === base) return true;
  return !end && path.startsWith(`${base}/`);
}

const router: UiRouter = {
  Link: StoryLink,
  useNavigate: () => useContext(StoryLocation).go,
  useMatch: useStoryMatch,
};

/**
 * Fluent's withFluentProvider, with the library's provider. On a docs page the
 * example sits in Fluent's example container (48px around it, on
 * colorNeutralBackground2); on its own, a story is the page (`page`), as an
 * app's root provider is. A component that is a whole page itself
 * (`parameters.fullPage`, StatusPage) fills a story alone, and on a docs page
 * stands at a set height rather than the window's (docs.css).
 */
const withUiProvider: Decorator = (Story, { id, globals, viewMode, parameters }) => {
  const { scheme, locale, dir } = readGlobals(globals);
  queueMicrotask(() => noteGlobals(globals));
  const docs = viewMode === "docs";
  const story = (
    <StoryLocationProvider key={id} initial={parameters.location ?? "/"}>
      <Story />
    </StoryLocationProvider>
  );
  return (
    <UiProvider scheme={scheme} locale={locale} dir={dir} router={router} page={!docs}>
      <StoryLocaleContext.Provider value={locale}>
        {parameters.fullPage && !docs ? (
          story
        ) : (
          <div
            className={parameters.fullPage ? "sw-full-page" : undefined}
            style={{
              padding: "48px 24px",
              backgroundColor: docs ? tokens.colorNeutralBackground2 : undefined,
              minHeight: docs ? undefined : "100vh",
              boxSizing: "border-box",
            }}
          >
            {story}
          </div>
        )}
      </StoryLocaleContext.Provider>
    </UiProvider>
  );
};

const preview: Preview = {
  decorators: [withUiProvider, withAriaLive as Decorator],
  initialGlobals: INITIAL_GLOBALS,
  parameters: {
    viewMode: "docs",
    controls: { disable: true, expanded: true },
    layout: "fullscreen",
    docs: {
      container: FluentDocsContainer,
      page: FluentDocsPage,
      // "Show code" shows the story as written: the example itself.
      source: { excludeDecorators: true, type: "code" },
    },
    reactStorybookAddon: { docs: true },
    options: {
      storySort: {
        method: "alphabetical",
        // Each group in the order a page is built, not alphabetical.
        order: [
          "Introduction",
          "Guides",
          ["Theme", "Strings", "Router"],
          "Page structure",
          [
            "PageHeader",
            "DetailHeader",
            "FormPage",
            "StatusPage",
            "EmptyState",
            "GetStartedPanel",
            "ViewBanner",
            "LabeledLine",
            "BrandMark",
          ],
          "Navigation",
          ["TopBar", "SideNav", "Outline", "PrevNext", "LoadingBar"],
          "Search",
          ["SearchField", "SearchButton", "CommandPalette"],
          "Settings",
          "Lists and data",
          ["DataList", "DataListSkeleton", "Overview", "Skeletons"],
          "Inputs",
          [
            "Segmented",
            "ThemeSwitch",
            "ThemeMenu",
            "Select",
            "CheckboxField",
            "PasswordInput",
            "DurationInput",
            "ColorPickerInput",
          ],
          "Copy",
          "Hooks",
          ["useConfirm", "useToastMessage", "More hooks"],
        ],
      },
    },
  } satisfies FluentParameters,
  tags: ["autodocs"],
};

export default preview;
