import {
  createContext,
  useContext,
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
 * How library components link and navigate. React Router fits as is:
 * `router={{ Link, useNavigate }}`.
 */
export interface UiRouter {
  Link: ComponentType<UiLinkProps>;
  /** A hook returning a navigate function. Called during render, like any hook. */
  useNavigate: () => (to: string) => void;
}

function AnchorLink({ to, state: _state, ...rest }: UiLinkProps) {
  return <a href={to} {...rest} />;
}

function useLocationNavigate() {
  return (to: string) => window.location.assign(to);
}

/** Plain `<a href>` links and full page loads: for apps without a client router. */
export const DEFAULT_ROUTER: UiRouter = { Link: AnchorLink, useNavigate: useLocationNavigate };

/** Receives the page's title from PageHeader, and null when the page goes. */
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

/** The app's page-title handler, if it gave `<UiProvider onPageTitle>`. */
export function useUiPageTitle(): PageTitleHandler | null {
  return useContext(UiContext).onPageTitle;
}
