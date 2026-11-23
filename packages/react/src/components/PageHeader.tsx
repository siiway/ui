// Shared page header: title + optional subtitle on the left, optional
// action buttons on the right. Keeps spacing and typography consistent
// across pages instead of each one rolling its own header row.

import { Text, Title2, makeStyles, tokens } from "@fluentui/react-components";
import type { CSSProperties, ReactNode } from "react";
import { useTabTitle } from "../provider/context.js";

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "24px",
  },
  titles: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: 0,
  },
  title: {
    letterSpacing: "-0.015em",
  },
  subtitle: {
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
});

interface PageHeaderProps {
  /** The page's heading. */
  title: ReactNode;
  /** A line under the title. */
  subtitle?: ReactNode;
  /** Buttons on the right; they wrap under the title on narrow screens. */
  actions?: ReactNode;
  /** Browser tab title when the visible title doesn't suit one, e.g. a
   *  greeting. Defaults to the title when it is a plain string. Goes to
   *  `<UiProvider onPageTitle>`. */
  tabTitle?: string;
  /** On the header's root, to override spacing, e.g. `marginBottom: 0` inside
   *  flex-gap layouts. */
  style?: CSSProperties;
}

export function PageHeader({ title, subtitle, actions, tabTitle, style }: PageHeaderProps) {
  const styles = useStyles();
  useTabTitle(title, tabTitle);
  return (
    <div className={styles.root} style={style}>
      <div className={styles.titles}>
        <Title2 className={styles.title}>{title}</Title2>
        {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
