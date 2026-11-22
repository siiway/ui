// Building blocks for account settings pages (Profile, Security), laid out
// like the Cloudflare dashboard's profile pages: a narrow column of cards,
// each with a title, a one-line description and an optional action on the
// right, holding either divided rows (label left, control right) or a padded
// form. Add flows open from the card's action instead of sitting open.

import {
  Button,
  MessageBar,
  Spinner,
  Subtitle2,
  Text,
  makeStyles,
  mergeClasses,
  tokens,
} from "@fluentui/react-components";
import { ChevronRightRegular } from "@fluentui/react-icons";
import type { ReactNode } from "react";
import { useUiStrings } from "../provider/context.js";
import { UiLink } from "../provider/context.js";

const NARROW = "@media (max-width: 640px)";

const useStyles = makeStyles({
  page: {
    maxWidth: "960px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  // Keeps the latest result in view while scrolled down a long page.
  toast: {
    position: "sticky",
    top: "8px",
    zIndex: 2,
  },
  card: {
    "--card-pad": "24px",
    scrollMarginTop: "16px",
    [NARROW]: { "--card-pad": "16px" },
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusXLarge,
    background: tokens.colorNeutralBackground1,
  },
  head: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px 16px",
    padding: "20px var(--card-pad) 16px",
  },
  titles: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: "1 1 320px",
    minWidth: 0,
  },
  titleLine: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  title: { margin: 0 },
  muted: {
    color: tokens.colorNeutralForeground3,
  },
  action: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px var(--card-pad) 20px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "12px 16px",
    minHeight: "60px",
    padding: "12px var(--card-pad)",
    boxSizing: "border-box",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    [NARROW]: { flexWrap: "wrap" },
  },
  rowIcon: {
    display: "inline-flex",
    flexShrink: 0,
    fontSize: "20px",
    color: tokens.colorNeutralForeground3,
  },
  rowText: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: "1 1 240px",
    minWidth: 0,
  },
  rowLabel: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "6px",
    minWidth: 0,
    overflowWrap: "anywhere",
  },
  // A div, not Text, so descriptions can hold block content.
  rowDesc: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground3,
    minWidth: 0,
  },
  rowControl: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: "8px",
    flexShrink: 0,
    maxWidth: "100%",
    [NARROW]: { justifyContent: "flex-start" },
  },
  subhead: {
    padding: "10px var(--card-pad)",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    background: tokens.colorNeutralBackground2,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  empty: {
    padding: "16px var(--card-pad)",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground3,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: "8px",
    padding: "12px var(--card-pad)",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  // A data table inside a card: edge cells line up with the card padding.
  table: {
    overflowX: "auto",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    "& th:first-child, & td:first-child": {
      paddingLeft: "var(--card-pad)",
    },
    "& th:last-child, & td:last-child": {
      paddingRight: "var(--card-pad)",
    },
    "& tbody tr:last-child": { borderBottomStyle: "none" },
  },
  linkRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minHeight: "60px",
    padding: "10px var(--card-pad)",
    boxSizing: "border-box",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    color: "inherit",
    textDecorationLine: "none",
    ":hover": { background: tokens.colorNeutralBackground1Hover },
    ":focus-visible": {
      outline: `2px solid ${tokens.colorStrokeFocus2}`,
      outlineOffset: "-2px",
    },
  },
  linkMeta: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    [NARROW]: { display: "none" },
  },
  chevron: {
    flexShrink: 0,
    fontSize: "16px",
    color: tokens.colorNeutralForeground3,
  },
  footerStart: {
    marginRight: "auto",
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
});

/** The column a settings page's cards stack in. */
export function SettingsPage({
  children,
}: {
  /** The cards, one under another. */
  children: ReactNode;
}) {
  const styles = useStyles();
  return <div className={styles.page}>{children}</div>;
}

/** A success or error message, such as a save's result, that stays in view
 *  while the page scrolls. */
export function SettingsToast({
  message,
}: {
  /** The message to show, or `null` for none. Pair it with `useToastMessage`. */
  message: { type: "success" | "error"; text: string } | null;
}) {
  const styles = useStyles();
  if (!message) return null;
  return (
    <div className={styles.toast} role="status">
      <MessageBar intent={message.type === "success" ? "success" : "error"}>
        {message.text}
      </MessageBar>
    </div>
  );
}

interface SettingsCardProps {
  /** An anchor for links to the card (`/page#id`), e.g. from search. */
  id?: string;
  /** The card's heading. */
  title: string;
  /** Muted text under the title. */
  description?: ReactNode;
  /** Shown beside the title, e.g. an Enabled badge. */
  badge?: ReactNode;
  /** Shown at the top right of the card, e.g. an Add button. */
  action?: ReactNode;
  /** What goes under the header: rows, a `SettingsBody`, a `SettingsTable`, a footer. */
  children?: ReactNode;
}

/** A card on a settings page: a header, then rows or a body. */
export function SettingsCard({
  id,
  title,
  description,
  badge,
  action,
  children,
}: SettingsCardProps) {
  const styles = useStyles();
  return (
    <section id={id} className={styles.card}>
      <div className={styles.head}>
        <div className={styles.titles}>
          <div className={styles.titleLine}>
            <Subtitle2 as="h2" className={styles.title}>
              {title}
            </Subtitle2>
            {badge}
          </div>
          {description && (
            <Text size={200} className={styles.muted}>
              {description}
            </Text>
          )}
        </div>
        {action && <div className={styles.action}>{action}</div>}
      </div>
      {children}
    </section>
  );
}

/** Padded content (a form, an editor) below the card header. */
export function SettingsBody({
  children,
}: {
  /** Content that isn't rows, such as a form or an editor. */
  children: ReactNode;
}) {
  const styles = useStyles();
  return <div className={styles.body}>{children}</div>;
}

interface SettingsRowProps {
  /** Shown before the label. */
  icon?: ReactNode;
  /** The setting's name. */
  label: ReactNode;
  /** Muted text under the label. It can hold block content. */
  description?: ReactNode;
  /** Controls on the right: a switch, a short input, row actions. On narrow
   *  screens they move under the label. */
  children?: ReactNode;
  /** Extra styles for the row. */
  className?: string;
}

/** One setting: its label on the left, its control on the right. */
export function SettingsRow({ icon, label, description, children, className }: SettingsRowProps) {
  const styles = useStyles();
  return (
    <div className={mergeClasses(styles.row, className)}>
      {icon && <span className={styles.rowIcon}>{icon}</span>}
      <div className={styles.rowText}>
        <div className={styles.rowLabel}>{label}</div>
        {description && <div className={styles.rowDesc}>{description}</div>}
      </div>
      {children && <div className={styles.rowControl}>{children}</div>}
    </div>
  );
}

/** A quiet heading between groups of rows. */
export function SettingsSubhead({
  children,
}: {
  /** The heading's text. */
  children: ReactNode;
}) {
  const styles = useStyles();
  return <div className={styles.subhead}>{children}</div>;
}

/** "Nothing here" inside a card. */
export function SettingsEmpty({
  children,
}: {
  /** The message, e.g. "No webhooks." */
  children: ReactNode;
}) {
  const styles = useStyles();
  return <div className={styles.empty}>{children}</div>;
}

/** The card's bottom bar. */
export function SettingsFooter({
  start,
  children,
}: {
  /** A note on the left, e.g. a byte count. */
  start?: ReactNode;
  /** Buttons, on the right. */
  children: ReactNode;
}) {
  const styles = useStyles();
  return (
    <div className={styles.footer}>
      {start && <span className={styles.footerStart}>{start}</span>}
      {children}
    </div>
  );
}

/** Discard + Save for a card's edits. Discard shows while there are unsaved
 *  changes; Save needs changes and is held while saving. */
export function SaveFooter({
  dirty,
  saving,
  disabled,
  onDiscard,
  onSave,
}: {
  /** There are unsaved changes: shows Discard and enables Save. */
  dirty: boolean;
  /** A save is in flight: hides Discard and shows a spinner in Save. */
  saving: boolean;
  /** Also hold Save, e.g. for invalid input or another save in flight. */
  disabled?: boolean;
  /** Called by Discard, to undo the edits. */
  onDiscard: () => void;
  /** Called by Save. */
  onSave: () => void;
}) {
  const strings = useUiStrings();
  return (
    <SettingsFooter>
      {dirty && !saving && (
        <Button appearance="subtle" onClick={onDiscard}>
          {strings.discardChanges}
        </Button>
      )}
      <Button appearance="primary" disabled={!dirty || saving || disabled} onClick={onSave}>
        {saving ? <Spinner size="tiny" /> : strings.saveChanges}
      </Button>
    </SettingsFooter>
  );
}

/** A table in a card, edge-aligned with the card's padding. */
export function SettingsTable({
  children,
}: {
  /** A Fluent `Table`. */
  children: ReactNode;
}) {
  const styles = useStyles();
  return <div className={styles.table}>{children}</div>;
}

interface SettingsLinkRowProps {
  /** Where the row links, through the app's router. */
  to: string;
  /** Shown before the label, usually an `Avatar`. */
  icon?: ReactNode;
  /** The row's name. */
  label: ReactNode;
  /** Muted text under the label. */
  description?: ReactNode;
  /** Muted facts on the right, hidden on narrow screens. */
  meta?: ReactNode;
}

/** A row that opens another page, e.g. one app in a team's app list. */
export function SettingsLinkRow({ to, icon, label, description, meta }: SettingsLinkRowProps) {
  const styles = useStyles();
  return (
    <UiLink to={to} className={styles.linkRow}>
      {icon}
      <div className={styles.rowText}>
        <div className={styles.rowLabel}>{label}</div>
        {description && <div className={styles.rowDesc}>{description}</div>}
      </div>
      {meta && <div className={styles.linkMeta}>{meta}</div>}
      <ChevronRightRegular className={styles.chevron} />
    </UiLink>
  );
}
