// Looks like a field, acts as a button: opens search, usually a
// CommandPalette. Prism has it at the top of its sidebar, Vellum in its top
// bar. It shows the shortcut that opens search too (useSearchShortcut).

import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { SearchRegular } from "@fluentui/react-icons";
import { useIsApple } from "../hooks/platform.js";
import { useUiStrings } from "../provider/context.js";

const useStyles = makeStyles({
  button: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "240px",
    maxWidth: "100%",
    height: "32px",
    padding: "0 8px 0 10px",
    boxSizing: "border-box",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    background: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground3,
    fontFamily: "inherit",
    fontSize: "13px",
    cursor: "pointer",
    "& > svg": { fontSize: "16px", flexShrink: 0 },
    ":hover": {
      borderTopColor: tokens.colorNeutralStroke1,
      borderRightColor: tokens.colorNeutralStroke1,
      borderBottomColor: tokens.colorNeutralStroke1,
      borderLeftColor: tokens.colorNeutralStroke1,
      color: tokens.colorNeutralForeground2,
    },
    ":focus-visible": {
      outline: `2px solid ${tokens.colorStrokeFocus2}`,
      outlineOffset: "1px",
    },
  },
  label: {
    flex: 1,
    minWidth: 0,
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  kbd: {
    padding: "0 5px",
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: "11px",
    lineHeight: "18px",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
});

export interface SearchButtonProps {
  /** Called on a click: open your search here. */
  onClick: () => void;
  /** The text in the field. Defaults to the library's "Search". */
  label?: string;
  /**
   * Show the Ctrl K / ⌘K hint. Defaults to true; turn it off where no shortcut
   * opens search. The server renders Ctrl K and the browser corrects it,
   * without a hydration mismatch.
   */
  shortcut?: boolean;
  /** 240px wide by default: set the width here, e.g. `100%` in a sidebar. */
  className?: string;
}

export function SearchButton({ onClick, label, shortcut = true, className }: SearchButtonProps) {
  const styles = useStyles();
  const strings = useUiStrings();
  const apple = useIsApple();
  return (
    <button
      type="button"
      className={mergeClasses(styles.button, className)}
      onClick={onClick}
      aria-keyshortcuts={shortcut ? "Control+K Meta+K" : undefined}
    >
      <SearchRegular />
      <span className={styles.label}>{label ?? strings.search}</span>
      {shortcut && <kbd className={styles.kbd}>{apple ? "⌘K" : "Ctrl K"}</kbd>}
    </button>
  );
}
