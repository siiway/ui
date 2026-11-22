// A full-page message: an icon or code, a title, a line of explanation and
// where to go next. Used for 404, access denied and signed-out pages: Prism's
// StatusPage, with what Vellum's 404 adds (the site above, the missing path,
// pages the reader may have meant).

import { Button, Text, Title2, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { ChevronRight16Regular } from "@fluentui/react-icons";
import type { ReactNode } from "react";
import { useCanvasClass } from "../provider/canvas.js";
import { UiLink, useUiNavigate } from "../provider/context.js";
import { BrandMark } from "./BrandMark.js";

const useStyles = makeStyles({
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    padding: "48px 40px",
    boxSizing: "border-box",
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    background: tokens.colorNeutralBackground2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    textAlign: "center",
    "@media (max-width: 540px)": { padding: "32px 20px" },
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  title: { margin: 0 },
  description: { color: tokens.colorNeutralForeground3 },
  hint: {
    alignSelf: "stretch",
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    overflowX: "auto",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "8px",
    marginTop: "8px",
  },
  links: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    gap: "1px",
    marginTop: "8px",
    paddingTop: "16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    textAlign: "left",
  },
  linksLabel: {
    padding: "0 10px 6px",
    fontSize: "12px",
    color: tokens.colorNeutralForeground3,
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minHeight: "32px",
    padding: "0 10px",
    borderRadius: tokens.borderRadiusMedium,
    fontSize: "13px",
    color: tokens.colorNeutralForeground2,
    textDecoration: "none",
    "& svg": { color: tokens.colorNeutralForeground3, flexShrink: 0 },
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
});

export interface StatusPageAction {
  /** The button's text. */
  label: string;
  /** An in-app path, opened through the app's router. */
  to: string;
}

export interface StatusPageProps {
  /** The big figure above the title: a code, an icon or an illustration. */
  mark: ReactNode;
  /** The page's `h1`. */
  title: ReactNode;
  /** A line of explanation under the title. */
  description: ReactNode;
  /** The site, small above the mark, for a page outside the app's layout. */
  brand?: { name: string; iconUrl?: string };
  /** A detail in monospace under the description, such as the path that wasn't found. */
  hint?: ReactNode;
  /** Label for a button that goes back in the browser's history, when going back makes sense. */
  back?: string;
  /** More ways on, between "go back" and the main one, such as search. */
  secondary?: StatusPageAction[];
  /** The main way on: the primary button, `{ label, to }`. */
  primary: StatusPageAction;
  /** Pages the reader may have meant, listed under the buttons. */
  links?: { label: ReactNode; to: string }[];
  /** The heading over `links`, such as "You might have been looking for". */
  linksLabel?: ReactNode;
}

export function StatusPage({
  mark,
  title,
  description,
  brand,
  hint,
  back,
  secondary,
  primary,
  links,
  linksLabel,
}: StatusPageProps) {
  const styles = useStyles();
  const canvas = useCanvasClass();
  const navigate = useUiNavigate();
  return (
    <div className={mergeClasses(styles.page, canvas)}>
      <div className={styles.card}>
        {brand && (
          <div className={styles.brand}>
            <BrandMark iconUrl={brand.iconUrl} size={20} />
            <span>{brand.name}</span>
          </div>
        )}
        {mark}
        <Title2 as="h1" className={styles.title}>
          {title}
        </Title2>
        <Text className={styles.description}>{description}</Text>
        {hint != null && <div className={styles.hint}>{hint}</div>}
        <div className={styles.actions}>
          {back && <Button onClick={() => window.history.back()}>{back}</Button>}
          {secondary?.map((action) => (
            <Button key={action.to} onClick={() => navigate(action.to)}>
              {action.label}
            </Button>
          ))}
          <Button appearance="primary" onClick={() => navigate(primary.to)}>
            {primary.label}
          </Button>
        </div>
        {links && links.length > 0 && (
          <div className={styles.links}>
            {linksLabel != null && <div className={styles.linksLabel}>{linksLabel}</div>}
            {links.map((link) => (
              <UiLink key={link.to} to={link.to} className={styles.link}>
                <ChevronRight16Regular />
                <span>{link.label}</span>
              </UiLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
