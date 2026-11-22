// What the stories share: their sample text in the toolbar's language, and a
// simple layout. The provider around each story comes from .storybook/preview.

import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { createContext, useContext, type CSSProperties, type ReactNode } from "react";

export type StoryLocale = "en" | "zh";

/** The toolbar's language, set by the preview's decorator. */
export const StoryLocaleContext = createContext<StoryLocale>("en");

/** Picks a story's sample text by the toolbar's language. */
export function useText(): (en: string, zh: string) => string {
  const locale = useContext(StoryLocaleContext);
  return (en, zh) => (locale === "zh" ? zh : en);
}

const useStyles = makeStyles({
  stack: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "12px" },
  row: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" },
});

export interface DemoProps {
  children: ReactNode;
  /** `stack`: children one under another; `row`: side by side; `block` (default): as they are. */
  layout?: "block" | "stack" | "row";
  /** Narrows the content, for inputs. */
  maxWidth?: number;
}

export function Demo({ children, layout = "block", maxWidth }: DemoProps) {
  const styles = useStyles();
  const style: CSSProperties | undefined = maxWidth ? { maxWidth } : undefined;
  return (
    <div
      className={mergeClasses(layout === "stack" && styles.stack, layout === "row" && styles.row)}
      style={style}
    >
      {children}
    </div>
  );
}
