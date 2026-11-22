// Layout for full-page create flows (new app, new team, new token): a back
// link to the list, the page header, and the form in a single card whose
// footer holds the actions. Used instead of modal dialogs so a create flow
// has its own URL and room to explain each field.

import { makeStyles, tokens } from "@fluentui/react-components";
import { ArrowLeftRegular } from "@fluentui/react-icons";
import type { ReactNode } from "react";
import { UiLink } from "../provider/context.js";
import { PageHeader } from "./PageHeader.js";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "720px",
  },
  back: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    alignSelf: "flex-start",
    marginBottom: "16px",
    fontSize: "13px",
    color: tokens.colorNeutralForeground3,
    ":hover": { color: tokens.colorNeutralForeground1 },
    ":focus-visible": {
      outline: `2px solid ${tokens.colorStrokeFocus2}`,
      outlineOffset: "2px",
      borderRadius: "2px",
    },
  },
  card: {
    borderRadius: tokens.borderRadiusXLarge,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    background: tokens.colorNeutralBackground1,
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    padding: "24px",
    "@media (max-width: 600px)": {
      padding: "16px",
    },
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: "8px",
    padding: "14px 24px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    "@media (max-width: 600px)": {
      padding: "12px 16px",
    },
  },
});

interface FormPageProps {
  /** The path of the back link above the header, opened through the app's router. */
  backTo: string;
  /** The back link's text, such as the list's name. */
  backLabel: string;
  /** The page's heading. */
  title: ReactNode;
  /** A line under the title. */
  subtitle?: ReactNode;
  /** The buttons at the card's foot; give the main one `type="submit"`. Leave out when
   *  the card shows a final result instead. */
  actions?: ReactNode;
  /** Called on submit; the page doesn't reload. Enter in a text field submits like the
   *  main button. */
  onSubmit?: () => void;
  /** The fields. */
  children: ReactNode;
}

export function FormPage({
  backTo,
  backLabel,
  title,
  subtitle,
  actions,
  onSubmit,
  children,
}: FormPageProps) {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <UiLink to={backTo} className={styles.back}>
        <ArrowLeftRegular />
        {backLabel}
      </UiLink>
      <PageHeader title={title} subtitle={subtitle} />
      <form
        className={styles.card}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
      >
        <div className={styles.body}>{children}</div>
        {actions && <div className={styles.footer}>{actions}</div>}
      </form>
    </div>
  );
}
