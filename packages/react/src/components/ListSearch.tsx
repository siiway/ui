// The search box above a list: a search icon, and a clear button once
// something is typed. Callers debounce the value themselves.

import { Button, Input, makeStyles, mergeClasses } from "@fluentui/react-components";
import { DismissRegular, SearchRegular } from "@fluentui/react-icons";
import type { ReactNode } from "react";
import { useUiStrings } from "../provider/context.js";

const useStyles = makeStyles({
  bar: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  input: { minWidth: "220px", flex: "1 1 220px" },
});

/** A search box above a list, with filters or buttons beside it. */
export function ListSearch({
  value,
  onChange,
  placeholder,
  children,
  className,
}: {
  /** The text in the box. */
  value: string;
  /** Called with the new text as it's typed, and with "" when it's cleared. */
  onChange: (value: string) => void;
  /** Shown while the box is empty, e.g. "Search teams". */
  placeholder: string;
  /** Filters or actions beside the box. */
  children?: ReactNode;
  /** Extra styles for the bar, e.g. padding inside a card. */
  className?: string;
}) {
  const styles = useStyles();
  const strings = useUiStrings();
  return (
    <div className={mergeClasses(styles.bar, className)}>
      <Input
        className={styles.input}
        value={value}
        onChange={(_, d) => onChange(d.value)}
        placeholder={placeholder}
        contentBefore={<SearchRegular />}
        contentAfter={
          value ? (
            <Button
              appearance="transparent"
              size="small"
              icon={<DismissRegular />}
              aria-label={strings.clear}
              onClick={() => onChange("")}
            />
          ) : undefined
        }
      />
      {children}
    </div>
  );
}
