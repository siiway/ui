// The strip across the top of a page, as in Vellum: the canvas with a
// hairline under it, the brand (and a crumb after it), links, then the app's
// actions (search, a ThemeMenu) at the end, all as compact 32px controls with
// a grey (not brand) selection.
//
// On a narrow screen it gives way in steps: the menu button that opens the
// app's navigation shows from 960px (or 768px) down, at the end or the start,
// the links go at 720px, the crumb at 540px.

import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  makeStyles,
  mergeClasses,
  tokens,
} from "@fluentui/react-components";
import { ChevronDown12Regular, Navigation20Regular } from "@fluentui/react-icons";
import type { ReactNode } from "react";
import { useCanvasClass } from "../provider/canvas.js";
import { UiLink, useUiNavigate, useUiStrings } from "../provider/context.js";
import { BrandMark } from "./BrandMark.js";

/** The top bar's height in pixels, for what sticks below it. */
export const TOP_BAR_HEIGHT = 52;

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    height: `${TOP_BAR_HEIGHT}px`,
    paddingInline: "16px 12px",
    boxSizing: "border-box",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "@media (max-width: 720px)": { gap: "4px", paddingInline: "8px" },
  },
  sticky: { position: "sticky", top: 0, zIndex: 100 },
  brandGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minWidth: 0,
    flexShrink: 1,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
    color: tokens.colorNeutralForeground1,
    textDecoration: "none",
    ":hover": { color: tokens.colorNeutralForeground1, textDecoration: "none" },
  },
  brandText: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  // Muted, like a path segment after the site's name.
  crumb: {
    gap: "8px",
    color: tokens.colorNeutralForeground3,
    ":hover": { color: tokens.colorNeutralForeground1 },
    "@media (max-width: 540px)": { display: "none" },
  },
  crumbText: {
    fontSize: tokens.fontSizeBase300,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  separator: {
    color: tokens.colorNeutralStroke1,
    fontSize: tokens.fontSizeBase400,
    userSelect: "none",
    "@media (max-width: 540px)": { display: "none" },
  },
  // A wrapper, because Fluent's Button sets its own display at the same
  // specificity as a class on it. Griffel's media queries are static, so the
  // widths it shows from are presets.
  menuButton: { display: "none" },
  menuBelow960: { "@media (max-width: 960px)": { display: "inline-flex" } },
  menuBelow768: { "@media (max-width: 768px)": { display: "inline-flex" } },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1px",
    marginLeft: "12px",
    "@media (max-width: 720px)": { display: "none" },
  },
  link: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    minHeight: "32px",
    paddingInline: "10px",
    boxSizing: "border-box",
    border: "none",
    borderRadius: tokens.borderRadiusMedium,
    background: "transparent",
    color: tokens.colorNeutralForeground2,
    textDecoration: "none",
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: tokens.fontWeightMedium,
    whiteSpace: "nowrap",
    cursor: "pointer",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground3,
      color: tokens.colorNeutralForeground1,
      textDecoration: "none",
    },
    ":focus-visible": {
      outline: `2px solid ${tokens.colorStrokeFocus2}`,
      outlineOffset: "-2px",
    },
  },
  linkActive: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
  },
  chevron: { color: tokens.colorNeutralForeground3 },
  spacer: { flex: 1 },
  actions: { display: "flex", alignItems: "center", gap: "2px" },
});

export interface TopBarBrand {
  /** The site's (or, for a crumb, the section's) name. */
  label: string;
  /** Where it leads: the home page, the section's first page. */
  to: string;
  /** An icon URL, drawn as a BrandMark before the name. */
  logo?: string;
}

export interface TopBarLink {
  /** The link's text. */
  label: ReactNode;
  /** An in-app path, or a full URL, which opens in a new tab. */
  to?: string;
  /** The reader is in this part of the site. A menu is active when one of its items is. */
  active?: boolean;
  /** Makes the link a menu of these. */
  items?: TopBarLink[];
}

export interface TopBarProps {
  /** `{ label, to, logo? }`: the site's name, where it leads, an icon URL. */
  brand: TopBarBrand;
  /** A second step after the brand, such as the section or project. Hidden from 540px down. */
  crumb?: TopBarBrand;
  /**
   * `{ label, to?, active?, items? }`. A full URL opens in a new tab; `items`
   * makes a menu, active when one of its items is. Hidden from 720px down.
   */
  links?: TopBarLink[];
  /** Shows a menu button from `menuBelow` down that calls this, to open the app's navigation. */
  onMenu?: () => void;
  /** Where the menu button sits: `"end"`, before the actions (the default), or `"start"`, before the brand. */
  menuPosition?: "start" | "end";
  /** The width the menu button shows from, and down: `960` (the default) or `768`, to match where the app's navigation becomes a drawer. */
  menuBelow?: 768 | 960;
  /** The menu button's name. Defaults to the library's "Open navigation". */
  menuLabel?: string;
  /** Names the links for screen readers. Defaults to the library's "Primary". */
  linksLabel?: string;
  /** Keeps it at the top of the window as the page scrolls. */
  sticky?: boolean;
  /** The actions at the end: a SearchButton, a ThemeMenu, icon buttons. */
  children?: ReactNode;
  className?: string;
}

const EXTERNAL = /^[a-z]+:\/\//i;

export function TopBar({
  brand,
  crumb,
  links,
  onMenu,
  menuPosition = "end",
  menuBelow = 960,
  menuLabel,
  linksLabel,
  sticky,
  children,
  className,
}: TopBarProps) {
  const styles = useStyles();
  const canvas = useCanvasClass();
  const strings = useUiStrings();
  const menu = onMenu && (
    <span
      className={mergeClasses(
        styles.menuButton,
        menuBelow === 768 ? styles.menuBelow768 : styles.menuBelow960,
      )}
    >
      <Button
        appearance="subtle"
        icon={<Navigation20Regular />}
        aria-label={menuLabel ?? strings.openNavigation}
        onClick={onMenu}
      />
    </span>
  );
  return (
    <header className={mergeClasses(styles.root, canvas, sticky && styles.sticky, className)}>
      {menuPosition === "start" && menu}
      <div className={styles.brandGroup}>
        <UiLink to={brand.to} className={styles.brand}>
          <BrandMark iconUrl={brand.logo} size={24} />
          <span className={styles.brandText}>{brand.label}</span>
        </UiLink>
        {crumb && (
          <>
            <span className={styles.separator} aria-hidden="true">
              /
            </span>
            <UiLink to={crumb.to} className={mergeClasses(styles.brand, styles.crumb)}>
              <BrandMark iconUrl={crumb.logo} size={20} />
              <span className={styles.crumbText}>{crumb.label}</span>
            </UiLink>
          </>
        )}
      </div>
      {links && links.length > 0 && (
        <nav className={styles.links} aria-label={linksLabel ?? strings.primaryNavigation}>
          {links.map((link, i) => (
            <BarLink key={i} link={link} styles={styles} />
          ))}
        </nav>
      )}
      <div className={styles.spacer} />
      <div className={styles.actions}>
        {menuPosition !== "start" && menu}
        {children}
      </div>
    </header>
  );
}

function BarLink({ link, styles }: { link: TopBarLink; styles: ReturnType<typeof useStyles> }) {
  const navigate = useUiNavigate();
  if (link.items) {
    const active = link.active ?? link.items.some((item) => item.active);
    return (
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <button type="button" className={mergeClasses(styles.link, active && styles.linkActive)}>
            {link.label}
            <ChevronDown12Regular className={styles.chevron} />
          </button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {link.items.map((item, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  if (!item.to) return;
                  if (EXTERNAL.test(item.to)) window.open(item.to, "_blank", "noopener,noreferrer");
                  else navigate(item.to);
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    );
  }
  const className = mergeClasses(styles.link, link.active && styles.linkActive);
  if (link.to && EXTERNAL.test(link.to)) {
    return (
      <a href={link.to} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    );
  }
  return (
    <UiLink to={link.to ?? "#"} className={className}>
      {link.label}
    </UiLink>
  );
}
