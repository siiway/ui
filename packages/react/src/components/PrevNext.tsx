// The previous and next pages at the foot of a page in a sequence (a guide,
// the docs): two bordered cards on the canvas. Hover darkens the hairline and
// lifts the fill by a shade, nothing more.

import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { ChevronLeft16Regular, ChevronRight16Regular } from "@fluentui/react-icons";
import type { ReactNode } from "react";
import { UiLink, useUiStrings } from "../provider/context.js";

const useStyles = makeStyles({
  root: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    "@media (max-width: 720px)": { gridTemplateColumns: "1fr" },
  },
  card: {
    display: "block",
    padding: "14px 16px",
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    textDecoration: "none",
    transition: "border-color 80ms ease, background-color 80ms ease",
    ":hover": {
      borderTopColor: tokens.colorNeutralStroke1Hover,
      borderRightColor: tokens.colorNeutralStroke1Hover,
      borderBottomColor: tokens.colorNeutralStroke1Hover,
      borderLeftColor: tokens.colorNeutralStroke1Hover,
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1,
      textDecoration: "none",
    },
    ":focus-visible": {
      outline: `2px solid ${tokens.colorStrokeFocus2}`,
      outlineOffset: "1px",
    },
  },
  next: { gridColumn: 2, textAlign: "right", "@media (max-width: 720px)": { gridColumn: 1 } },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    color: tokens.colorNeutralForeground3,
  },
  labelNext: { justifyContent: "flex-end" },
  title: {
    display: "block",
    marginTop: "4px",
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },
});

export interface PrevNextLink {
  /** The page's title. */
  label: ReactNode;
  /** Where it leads, through the app's router. */
  to: string;
}

export interface PrevNextProps {
  /** The page before: `{ label, to }`, on a card labelled with the library's "Previous". */
  prev?: PrevNextLink;
  /** The page after: `{ label, to }`, on a card labelled with the library's "Next". */
  next?: PrevNextLink;
  className?: string;
}

export function PrevNext({ prev, next, className }: PrevNextProps) {
  const styles = useStyles();
  const strings = useUiStrings();
  if (!prev && !next) return null;
  return (
    <div className={mergeClasses(styles.root, className)}>
      {prev && (
        <UiLink to={prev.to} className={styles.card}>
          <span className={styles.label}>
            <ChevronLeft16Regular />
            {strings.previous}
          </span>
          <span className={styles.title}>{prev.label}</span>
        </UiLink>
      )}
      {next && (
        <UiLink to={next.to} className={mergeClasses(styles.card, styles.next)}>
          <span className={mergeClasses(styles.label, styles.labelNext)}>
            {strings.next}
            <ChevronRight16Regular />
          </span>
          <span className={styles.title}>{next.label}</span>
        </UiLink>
      )}
    </div>
  );
}
