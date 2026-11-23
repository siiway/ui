import {
  FluentProvider,
  makeStaticStyles,
  tokens,
  useIsomorphicLayoutEffect,
  type FluentProviderProps,
} from "@fluentui/react-components";
import { CANVAS, DEFAULT_ACCENT, pickStrings, type Scheme, type UiStrings } from "@siiway/ui-core";
import { useMemo } from "react";
import { createTheme } from "../theme/createTheme.js";
import { DEFAULT_ROUTER, UiContext, type PageTitleHandler, type UiRouter } from "./context.js";

export interface UiProviderProps extends Omit<FluentProviderProps, "theme"> {
  /** The scheme to render in: `useThemeMode().scheme`, or the app's own. */
  scheme: Scheme;
  /**
   * This provider is the page. It takes the canvas colour, removes the
   * body's margin, and draws `<html>` in the scheme (`data-scheme`,
   * `color-scheme`, the canvas background), as `schemeBootScript` does
   * before the app loads. Selected text takes a tint of the accent, and
   * scrollbars are thin. Set it on the app's outermost provider only.
   */
  page?: boolean;
  /** Brand colour; missing or invalid gives Fluent's blue. */
  accent?: string | null;
  /** BCP-47 tag for the library's own strings: `zh*` is Chinese, anything else English. */
  locale?: string | null;
  /** Replaces individual library strings. */
  strings?: Partial<UiStrings>;
  /**
   * The app's router. Without one, links are `<a href>` and navigation
   * reloads the page. Pass a stable object (define it at module level).
   */
  router?: UiRouter;
  /**
   * Called with a page's title when its PageHeader or DetailHeader mounts
   * (`tabTitle`, or the title if it's plain text), and with null when the
   * page goes, so the app can set the browser tab's title. Pass a stable
   * function.
   */
  onPageTitle?: PageTitleHandler;
}

// The look's rules for Fluent's own parts, wherever they render. Badges keep
// their label on one line: in a narrow flex row, CJK text otherwise wraps a
// character at a time. Surfaces that float (in a portal, outside the page's
// containers) get a hairline on top of their shadow, which barely shows on the
// dark canvas.
const useLookStyles = makeStaticStyles({
  ".fui-Badge": { whiteSpace: "nowrap", flexShrink: "0" },
  ".fui-DialogSurface, .fui-MenuPopover, .fui-PopoverSurface, .fui-Listbox": {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

function LookStyles() {
  useLookStyles();
  return null;
}

// Selected text takes a tint of the accent, and scrollbars are thin, with a
// neutral thumb on a clear track in either scheme.
const usePageStyles = makeStaticStyles({
  body: { margin: "0" },
  "::selection": {
    backgroundColor: `color-mix(in srgb, var(--colorBrandBackground, ${DEFAULT_ACCENT}) 22%, transparent)`,
  },
  "::-webkit-scrollbar": { width: "8px", height: "8px" },
  "::-webkit-scrollbar-track": { backgroundColor: "transparent" },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0, 0, 0, 0.16)",
    backgroundClip: "padding-box",
    border: "2px solid transparent",
    borderRadius: "4px",
  },
  "::-webkit-scrollbar-thumb:hover": { backgroundColor: "rgba(0, 0, 0, 0.32)" },
  'html[data-scheme="dark"] ::-webkit-scrollbar-thumb': {
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },
  'html[data-scheme="dark"] ::-webkit-scrollbar-thumb:hover': {
    backgroundColor: "rgba(255, 255, 255, 0.28)",
  },
});

// <html> in the page's scheme, for what lies outside the provider: the
// overscroll area, the scrollbars, form controls' native parts.
function PageScheme({ scheme }: { scheme: Scheme }) {
  usePageStyles();
  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-scheme", scheme);
    root.style.colorScheme = scheme;
    root.style.backgroundColor = CANVAS[scheme];
    return () => {
      root.removeAttribute("data-scheme");
      root.style.removeProperty("color-scheme");
      root.style.removeProperty("background-color");
    };
  }, [scheme]);
  return null;
}

/**
 * Fluent's provider with the SiiWay theme, plus the library's strings and
 * router. Wrap the app in it once, where FluentProvider used to be.
 */
export function UiProvider({
  scheme,
  page,
  accent,
  locale,
  strings,
  router,
  onPageTitle,
  children,
  ...rest
}: UiProviderProps) {
  const theme = useMemo(() => createTheme({ scheme, accent }), [scheme, accent]);
  const resolved = useMemo(() => pickStrings(locale, strings), [locale, strings]);
  const value = useMemo(
    () => ({
      scheme,
      strings: resolved,
      router: router ?? DEFAULT_ROUTER,
      onPageTitle: onPageTitle ?? null,
    }),
    [scheme, resolved, router, onPageTitle],
  );
  // Fluent paints its provider colorNeutralBackground1; the page is the canvas.
  const style = page ? { backgroundColor: CANVAS[scheme], ...rest.style } : rest.style;
  return (
    <FluentProvider theme={theme} {...rest} style={style}>
      <LookStyles />
      {page && <PageScheme scheme={scheme} />}
      <UiContext.Provider value={value}>{children}</UiContext.Provider>
    </FluentProvider>
  );
}
