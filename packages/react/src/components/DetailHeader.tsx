// The top of a detail page (an app, a team, a user, a notice…): the way back
// to its list, then its name with badges, a line under it, and an action.

import { Text, Title2, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { ArrowLeftRegular } from "@fluentui/react-icons";
import type { ReactNode } from "react";
import { useTabTitle } from "../provider/context.js";
import { ButtonLink } from "./ButtonLink.js";

const useStyles = makeStyles({
  back: {
    alignSelf: "flex-start",
    marginLeft: "-8px",
    color: tokens.colorNeutralForeground3,
  },
  header: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  titles: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: "1 1 240px",
    minWidth: 0,
  },
  titleLine: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
  },
  title: { margin: 0, letterSpacing: "-0.015em", overflowWrap: "anywhere" },
  subtitle: {
    color: tokens.colorNeutralForeground3,
    overflowWrap: "anywhere",
  },
});

/** "← Apps": back to the list the page was opened from. */
export function BackButton({
  to,
  children,
}: {
  /** The list's path, opened through the app's router. */
  to: string;
  /** The list's name. */
  children: ReactNode;
}) {
  const styles = useStyles();
  return (
    <ButtonLink
      to={to}
      appearance="subtle"
      size="small"
      icon={<ArrowLeftRegular />}
      className={styles.back}
    >
      {children}
    </ButtonLink>
  );
}

export function DetailHeader({
  icon,
  title,
  badges,
  subtitle,
  actions,
  tabTitle,
  className,
}: {
  /** An avatar or icon before the name. */
  icon?: ReactNode;
  /** The item's name, the page's `h1`. */
  title: ReactNode;
  /** Badges after the name, such as "Verified". */
  badges?: ReactNode;
  /** A line under the name. */
  subtitle?: ReactNode;
  /** Buttons at the end of the row, e.g. "Edit" or "Visit website". */
  actions?: ReactNode;
  /** Browser tab title when the name isn't plain text, e.g. a link. Defaults
   *  to the title when it is a plain string. Goes to
   *  `<UiProvider onPageTitle>`. */
  tabTitle?: string;
  className?: string;
}) {
  const styles = useStyles();
  useTabTitle(title, tabTitle);
  return (
    <div className={mergeClasses(styles.header, className)}>
      {icon}
      <div className={styles.titles}>
        <div className={styles.titleLine}>
          <Title2 as="h1" className={styles.title}>
            {title}
          </Title2>
          {badges}
        </div>
        {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
      </div>
      {actions}
    </div>
  );
}
