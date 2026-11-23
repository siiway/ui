import {
  createContext,
  useContext,
  useEffect,
  type ComponentType,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { UI_STRINGS, type Scheme, type UiStrings } from "@siiway/ui-core";

/** Props the library passes to the app's link component. */
export interface UiLinkProps {
  /** An in-app path, e.g. `/apps/123`. */
  to: string;
  /** History state, for routers that keep it (React Router's `state`). */
  state?: unknown;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  /** `"page"` on the link to the page the reader is on (SideNav, TopBar). */
  "aria-current"?: "page";
  children?: ReactNode;
}

/**
 * How library components link, navigate and know the current page. React
 * Router fits as is: `router={{ Link, useNavigate }}`, plus `useMatch`.
 */
export interface UiRouter {
  Link: ComponentType<UiLinkProps>;
  /** A hook returning a navigate function. Called during render, like any hook. */
  useNavigate: () => (to: string) => void;
  /**
   * A hook: whether the reader is on `to`, or on a page below it unless
   * `end`. SideNav asks it for items without `active`. React Router:
   * `(to, end) => useMatch({ path: to, end }) !== null`.
   */
  useMatch?: (to: string, end: boolean) => boolean;
}

function AnchorLink({ to, state: _state, ...rest }: UiLinkProps) {
  return <a href={to} {...rest} />;
}

function useLocationNavigate() {
  return (to: string) => window.location.assign(to);
}

/** Plain `<a href>` links and full page loads: for apps without a client router. */
export const DEFAULT_ROUTER: UiRouter = { Link: AnchorLink, useNavigate: useLocationNavigate };

/** Receives the page's title from its header, and null when the page goes. */
export type PageTitleHandler = (title: string | null) => void;

export interface UiContextValue {
  scheme: Scheme;
  strings: UiStrings;
  router: UiRouter;
  onPageTitle: PageTitleHandler | null;
}

export const UiContext = createContext<UiContextValue>({
  scheme: "light",
  strings: UI_STRINGS.en,
  router: DEFAULT_ROUTER,
  onPageTitle: null,
});

/** The library's own strings, in the locale given to `<UiProvider>`. */
export function useUiStrings(): UiStrings {
  return useContext(UiContext).strings;
}

/** The scheme `<UiProvider>` renders in. */
export function useUiScheme(): Scheme {
  return useContext(UiContext).scheme;
}

/** A link through the app's router (React Router's `Link`, or `<a href>`). */
export function UiLink(props: UiLinkProps) {
  const { Link } = useContext(UiContext).router;
  return <Link {...props} />;
}

/** A function that navigates to an in-app path. */
export function useUiNavigate(): (to: string) => void {
  return useContext(UiContext).router.useNavigate();
}

/**
 * Whether the reader is on `to`, or on a page below it unless `end`, by the
 * router's `useMatch`; false without one. Keep the same router: one that
 * gains or loses `useMatch` changes the hooks this calls.
 */
export function useUiMatch(to: string, end = false): boolean {
  const { router } = useContext(UiContext);
  return router.useMatch ? router.useMatch(to, end) : false;
}

/** The app's page-title handler, if it gave `<UiProvider onPageTitle>`. */
export function useUiPageTitle(): PageTitleHandler | null {
  return useContext(UiContext).onPageTitle;
}

// The header each handler last heard from. Only it clears the title, so a
// page that leaves after the next one came (in a route transition) doesn't
// clear the next one's.
const titleOwners = new WeakMap<PageTitleHandler, object>();

// Names the browser tab after a page header ("Security · Prism"): `tabTitle`,
// or the title when it's plain text; a rich or empty title (a name still
// loading, say) leaves the site name.
export function useTabTitle(title: ReactNode, tabTitle?: string) {
  const onPageTitle = useUiPageTitle();
  const text = tabTitle ?? (typeof title === "string" ? title : null);
  useEffect(() => {
    if (!text || !onPageTitle) return;
    const owner = {};
    titleOwners.set(onPageTitle, owner);
    onPageTitle(text);
    return () => {
      if (titleOwners.get(onPageTitle) !== owner) return;
      titleOwners.delete(onPageTitle);
      onPageTitle(null);
    };
  }, [text, onPageTitle]);
}
