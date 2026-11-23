// A navigation column, as Prism's sidebar and Vellum's docs sidebar draw it:
// flat on the canvas, 13px items with a grey (not brand) highlight on the
// current page, quiet 12px group labels, and nested items under a hairline.
// The router tells it the current page. Where it sits (sticky, its width, a
// drawer on a phone) is the app's layout.

import { Text, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import type { ReactNode } from "react";
import { UiLink, useUiMatch } from "../provider/context.js";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    boxSizing: "border-box",
  },
  group: { marginBottom: "6px" },
  // Pushed to the bottom by the space the nav has to spare.
  groupEnd: { marginTop: "auto" },
  label: {
    display: "block",
    margin: 0,
    padding: "16px 10px 6px",
    fontSize: "12px",
    fontWeight: tokens.fontWeightRegular,
    lineHeight: "16px",
    color: tokens.colorNeutralForeground3,
  },
  labelFirst: { paddingTop: "6px" },
  list: { display: "flex", flexDirection: "column", gap: "1px" },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minHeight: "32px",
    paddingInline: "10px",
    paddingBlock: "6px",
    boxSizing: "border-box",
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorNeutralForeground2,
    textDecoration: "none",
    fontSize: "13px",
    lineHeight: "18px",
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
  active: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightMedium,
  },
  // An item with items under it.
  branch: {
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
  },
  muted: {
    color: tokens.colorNeutralForeground3,
    fontWeight: tokens.fontWeightRegular,
  },
  // A branch without a link of its own.
  heading: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minHeight: "32px",
    paddingInline: "10px",
    paddingBlock: "6px",
    boxSizing: "border-box",
    fontSize: "13px",
    lineHeight: "18px",
  },
  icon: {
    display: "inline-flex",
    flexShrink: 0,
    fontSize: "16px",
    color: tokens.colorNeutralForeground3,
  },
  nested: {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
    marginLeft: "14px",
    paddingLeft: "6px",
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

export interface SideNavItem {
  /** The item's text. */
  label: ReactNode;
  /** An in-app path. Without one, the item is a heading for its `items`. */
  to?: string;
  /** Shown before the label. */
  icon?: ReactNode;
  /**
   * The page the reader is on; the item gets `aria-current="page"`. Leave it
   * out and the router's `useMatch` decides.
   */
  active?: boolean;
  /**
   * Current on its own path only, not on the pages below it: for `/`, or an
   * item whose pages are its `items`.
   */
  end?: boolean;
  /** Drawn quieter: grey, at regular weight. For a way out of a section, say. */
  muted?: boolean;
  /** Items under this one, indented. */
  items?: SideNavItem[];
}

export interface SideNavGroup {
  /** A quiet label above the group's items. */
  label?: ReactNode;
  /**
   * `"end"` puts the group at the bottom, when the nav is taller than its
   * groups (give it a height). Make it the last group.
   */
  placement?: "end";
  /** The group's items: `{ label, to?, icon?, active?, end?, muted?, items? }`. */
  items: SideNavItem[];
}

export interface SideNavProps {
  /** The groups, in order: `{ label?, placement?, items }`. */
  groups: SideNavGroup[];
  /** Names the navigation for screen readers, e.g. "Documentation". */
  label: string;
  /** Called on a click on any item, e.g. to close the drawer it's in. */
  onNavigate?: () => void;
  /** Where it sits is your layout: its width, `position: sticky`, its own scrolling. */
  className?: string;
}

type Styles = ReturnType<typeof useStyles>;

export function SideNav({ groups, label, onNavigate, className }: SideNavProps) {
  const styles = useStyles();
  return (
    <nav aria-label={label} className={mergeClasses(styles.root, className)}>
      {groups.map((group, g) => (
        <section
          key={g}
          className={mergeClasses(styles.group, group.placement === "end" && styles.groupEnd)}
        >
          {group.label != null && (
            <Text as="h2" className={mergeClasses(styles.label, g === 0 && styles.labelFirst)}>
              {group.label}
            </Text>
          )}
          <div className={styles.list}>
            {group.items.map((item, i) => (
              <Item key={item.to ?? i} item={item} onNavigate={onNavigate} styles={styles} />
            ))}
          </div>
        </section>
      ))}
    </nav>
  );
}

function Item({
  item,
  onNavigate,
  styles,
}: {
  item: SideNavItem;
  onNavigate?: () => void;
  styles: Styles;
}) {
  const branch = !!item.items?.length;
  const content = (
    <>
      {item.icon && <span className={styles.icon}>{item.icon}</span>}
      {item.label}
    </>
  );
  const head =
    item.to != null ? (
      <ItemLink item={item} to={item.to} branch={branch} onNavigate={onNavigate} styles={styles}>
        {content}
      </ItemLink>
    ) : (
      <div className={mergeClasses(styles.heading, styles.branch, item.muted && styles.muted)}>
        {content}
      </div>
    );
  if (!branch) return head;
  return (
    <div>
      {head}
      <div className={styles.nested}>
        {item.items!.map((sub, i) => (
          <Item key={sub.to ?? i} item={sub} onNavigate={onNavigate} styles={styles} />
        ))}
      </div>
    </div>
  );
}

// A link item: its own component, so only links call the router's hook.
function ItemLink({
  item,
  to,
  branch,
  onNavigate,
  styles,
  children,
}: {
  item: SideNavItem;
  to: string;
  branch: boolean;
  onNavigate?: () => void;
  styles: Styles;
  children: ReactNode;
}) {
  const matched = useUiMatch(to, item.end ?? false);
  const active = item.active ?? matched;
  return (
    <UiLink
      to={to}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={mergeClasses(
        styles.item,
        branch && styles.branch,
        item.muted && styles.muted,
        active && styles.active,
      )}
    >
      {children}
    </UiLink>
  );
}
