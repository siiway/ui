// Shared pagination bar: the item count, previous / next and jump-to-page
// with the current and total page count. Hidden while every row fits on the
// first page.

import { Button, Input, Text, makeStyles, tokens } from "@fluentui/react-components";
import { useState } from "react";
import { useUiStrings } from "../provider/context.js";
import { SettingsFooter } from "./Settings.js";

const useStyles = makeStyles({
  pager: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "8px",
    flexWrap: "wrap",
    // Directly under the list it pages, not pinned to the window bottom
    // where it ends up far from a short list.
    paddingTop: "12px",
  },
  pageCount: {
    color: tokens.colorNeutralForeground3,
    whiteSpace: "nowrap",
  },
  jump: { width: "64px" },
});

interface PaginationProps {
  /** The page shown, from 1. */
  page: number;
  /** Rows across all pages. */
  total: number;
  /** Rows per page. */
  pageSize: number;
  /** Called with the page to show. */
  onChange: (page: number) => void;
  /** Disables Previous and Next while a fetch is in flight. */
  disabled?: boolean;
  /** Sit in a `SettingsFooter`, for a list inside a settings card. */
  footer?: boolean;
}

/** Previous and next, the page as "2 / 5", the total, and a box to jump to a
 *  page. Hidden while every row fits on the first page. */
export function Pagination({ page, total, pageSize, onChange, disabled, footer }: PaginationProps) {
  const styles = useStyles();
  const strings = useUiStrings();
  const [jump, setJump] = useState("");
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const goToPage = () => {
    const n = Number.parseInt(jump, 10);
    if (!Number.isNaN(n)) {
      onChange(Math.min(pageCount, Math.max(1, n)));
      setJump("");
    }
  };

  // A list that shrank under a later page (e.g. after deleting its last row)
  // keeps the controls, so Previous still leads back to the rows.
  if (pageCount <= 1 && page <= 1) return null;

  const bar = (
    <div className={styles.pager}>
      <Text size={200} className={styles.pageCount}>
        {strings.totalItems(total)}
      </Text>
      <Button
        size="small"
        appearance="subtle"
        disabled={disabled || page <= 1}
        onClick={() => onChange(page - 1)}
      >
        {strings.previous}
      </Button>
      <Text size={200} className={styles.pageCount}>
        {strings.pageOf(page, pageCount)}
      </Text>
      <Button
        size="small"
        appearance="subtle"
        disabled={disabled || page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        {strings.next}
      </Button>
      <Input
        className={styles.jump}
        size="small"
        type="number"
        min={1}
        max={pageCount}
        value={jump}
        onChange={(_, d) => setJump(d.value)}
        onKeyDown={(e) => e.key === "Enter" && goToPage()}
        placeholder={strings.pageNumber}
        aria-label={strings.goToPage}
      />
      <Button size="small" appearance="subtle" onClick={goToPage}>
        {strings.go}
      </Button>
    </div>
  );
  return footer ? <SettingsFooter>{bar}</SettingsFooter> : bar;
}
