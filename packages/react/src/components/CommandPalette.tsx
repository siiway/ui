// Ctrl K search, as Prism and Vellum both have it: a dialog pinned near the
// top of the screen (so the list grows downwards and the field stays put), a
// field, grouped results and the keys to use them. ↑ ↓ move, Enter opens,
// Esc closes. The app does the searching: it hears the query and gives the
// groups to show.

import {
  Button,
  Dialog,
  DialogSurface,
  Spinner,
  makeStyles,
  mergeClasses,
  tokens,
  useIsomorphicLayoutEffect,
} from "@fluentui/react-components";
import { ArrowEnterLeftRegular, DismissRegular, SearchRegular } from "@fluentui/react-icons";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useUiStrings } from "../provider/context.js";

// Highlighted terms (<mark>) and code in titles and excerpts.
const inline = {
  "& mark": {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    color: tokens.colorPaletteYellowForeground1,
    paddingInline: "3px",
    borderRadius: "2px",
    fontWeight: tokens.fontWeightSemibold,
  },
  "& code": {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: "0.92em",
    paddingInline: "4px",
    paddingBlock: "1px",
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground3,
  },
} as const;

const useStyles = makeStyles({
  surface: {
    width: "min(640px, calc(100vw - 32px))",
    maxWidth: "640px",
    padding: 0,
    alignSelf: "flex-start",
    marginTop: "12vh",
    overflow: "hidden",
    borderRadius: tokens.borderRadiusXLarge,
    "@media (max-width: 640px)": { marginTop: "16px" },
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 10px 0 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "& > svg": { fontSize: "18px", color: tokens.colorNeutralForeground3, flexShrink: 0 },
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: "52px",
    padding: 0,
    border: "none",
    outline: "none",
    background: "transparent",
    color: tokens.colorNeutralForeground1,
    fontFamily: "inherit",
    fontSize: tokens.fontSizeBase400,
    "::placeholder": { color: tokens.colorNeutralForeground4 },
  },
  list: {
    maxHeight: "min(60vh, 480px)",
    overflowY: "auto",
    padding: "6px",
  },
  group: { marginBottom: "4px" },
  groupHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    minHeight: "28px",
    padding: "6px 4px 2px 10px",
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 10px",
    borderRadius: tokens.borderRadiusMedium,
    cursor: "pointer",
    color: tokens.colorNeutralForeground1,
  },
  active: { backgroundColor: tokens.colorNeutralBackground1Hover },
  itemIcon: {
    display: "inline-flex",
    flexShrink: 0,
    fontSize: "18px",
    color: tokens.colorNeutralForeground3,
  },
  itemText: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: tokens.fontSizeBase300,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    ...inline,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  excerpt: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: 1.4,
    color: tokens.colorNeutralForeground2,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    ...inline,
  },
  action: { display: "inline-flex", flexShrink: 0 },
  enter: {
    flexShrink: 0,
    fontSize: "14px",
    color: tokens.colorNeutralForeground3,
    visibility: "hidden",
  },
  enterVisible: { visibility: "visible" },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "28px 16px",
    textAlign: "center",
    color: tokens.colorNeutralForeground3,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    padding: "8px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    "@media (max-width: 640px)": { display: "none" },
  },
  hints: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" },
  hint: { display: "inline-flex", alignItems: "center", gap: "4px" },
  kbd: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "18px",
    height: "18px",
    paddingInline: "5px",
    boxSizing: "border-box",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    fontFamily: "inherit",
    fontSize: "11px",
    lineHeight: 1,
  },
});

export interface CommandItem<T = unknown> {
  /** Unique within the palette. */
  id: string;
  /** Anything of yours, handed back with the row to `onSelect`: what the row stands for. */
  data?: T;
  /** The row's text. Wrap matched words in `<mark>` to highlight them. */
  title: ReactNode;
  /** One line under the title: where the result is, what matched. */
  subtitle?: ReactNode;
  /** Up to two lines under that, such as a passage of the page. `<mark>` highlights here too. */
  excerpt?: ReactNode;
  /** Shown before the text. */
  icon?: ReactNode;
  /**
   * A button at the row's end, such as "Remove" on a recent search. Clicking
   * it doesn't open the row.
   */
  action?: ReactNode;
}

export interface CommandGroup<T = unknown> {
  /** The group's heading. With none, the items follow the group before. */
  label?: ReactNode;
  /** A button beside the heading, such as "Clear" for recent searches. */
  action?: ReactNode;
  /** The group's rows. A group without any isn't shown. */
  items: CommandItem<T>[];
}

export interface CommandPaletteProps<T = unknown> {
  /** Whether the palette is open. */
  open: boolean;
  /** Called with the new state, as when Esc or the close button closes it. */
  onOpenChange: (open: boolean) => void;
  /**
   * The field's text, if you hold it: clear it as you open the palette to
   * start a new search. Leave it out and the palette holds it, emptying the
   * field each time it opens.
   */
  query?: string;
  /**
   * Called with the field's text as it changes. Without `query`, that
   * includes the empty field of each opening.
   */
  onQueryChange: (query: string) => void;
  /**
   * What to show for the query: `{ label?, action?, items }` each. `action`
   * is a button beside the label, such as "Clear".
   */
  groups: CommandGroup<T>[];
  /**
   * Called on Enter, or a click on a row, with the row and its `data`. Close
   * the palette here when the row leads away.
   */
  onSelect: (item: CommandItem<T>) => void;
  /** The field's placeholder and accessible name. */
  placeholder: string;
  /** Shows a spinner in the field while results are on their way. */
  loading?: boolean;
  /** Shown when no group has items: a start screen, or "No results". */
  empty?: ReactNode;
  /** The footer's right side, such as a count of results. */
  status?: ReactNode;
}

export function CommandPalette<T = unknown>({
  open,
  onOpenChange,
  query,
  onQueryChange,
  groups,
  onSelect,
  placeholder,
  loading,
  empty,
  status,
}: CommandPaletteProps<T>) {
  const styles = useStyles();
  const strings = useUiStrings();
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // The rows in the order they're drawn, for the arrow keys, and where each
  // group's rows start among them.
  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  const starts = useMemo(
    () =>
      groups.map((_, g) =>
        groups.slice(0, g).reduce((sum, before) => sum + before.items.length, 0),
      ),
    [groups],
  );
  // The active row, by id: when the results change under it, the first row
  // takes over, so Enter always opens what's at the top of fresh results.
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIndex = Math.max(
    0,
    flat.findIndex((item) => item.id === activeId),
  );
  const active = flat[activeIndex];

  // Each opening starts at the top row. Without `query`, the palette holds
  // the text, and each opening starts a new search: the field empties as the
  // palette opens, and the app hears of it before the palette paints, to give
  // the groups for the empty text.
  const controlled = query !== undefined;
  const [ownQuery, setOwnQuery] = useState("");
  const text = controlled ? query : ownQuery;
  const [wasOpen, setWasOpen] = useState(false);
  const [emptied, setEmptied] = useState(0);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setActiveId(null);
      if (!controlled) {
        setOwnQuery("");
        setEmptied(emptied + 1);
      }
    }
  }
  // Once per emptying: not again when Strict Mode reruns the effect, nor on
  // every render, as onQueryChange may be a new function each time.
  const reported = useRef(0);
  useIsomorphicLayoutEffect(() => {
    if (reported.current === emptied) return;
    reported.current = emptied;
    onQueryChange("");
  }, [emptied]);

  useEffect(() => {
    if (!active) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, activeIndex]);

  const optionId = (index: number) => `${listId}-${index}`;

  // The field keeps focus, as a combobox's does: a press on a row or its
  // button doesn't take it, and when a button removes itself (a recent
  // search), focus goes back to the field rather than to nowhere.
  const keepFocus = (e: MouseEvent) => e.preventDefault();
  const afterAction = (e: MouseEvent) => {
    e.stopPropagation();
    requestAnimationFrame(() => {
      const now = document.activeElement;
      if (!now || now === document.body || !now.isConnected) inputRef.current?.focus();
    });
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
      <DialogSurface className={styles.surface} aria-label={placeholder}>
        <div className={styles.inputRow}>
          <SearchRegular />
          <input
            ref={inputRef}
            autoFocus
            className={styles.input}
            role="combobox"
            aria-expanded
            aria-autocomplete="list"
            aria-controls={listId}
            aria-activedescendant={active ? optionId(activeIndex) : undefined}
            aria-label={placeholder}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            value={text}
            onChange={(e) => {
              if (!controlled) setOwnQuery(e.target.value);
              onQueryChange(e.target.value);
              setActiveId(null);
            }}
            onKeyDown={(e) => {
              // An input method's Enter commits its text, not a result.
              if (e.nativeEvent.isComposing) return;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                const next = flat[Math.min(flat.length - 1, activeIndex + 1)];
                if (next) setActiveId(next.id);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const prev = flat[Math.max(0, activeIndex - 1)];
                if (prev) setActiveId(prev.id);
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (active) onSelect(active);
              }
            }}
          />
          {loading && <Spinner size="extra-tiny" />}
          <Button
            appearance="subtle"
            size="small"
            icon={<DismissRegular />}
            aria-label={strings.close}
            onClick={() => onOpenChange(false)}
          />
        </div>

        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={placeholder}
          className={styles.list}
        >
          {flat.length === 0
            ? empty != null && <div className={styles.empty}>{empty}</div>
            : groups.map((group, g) =>
                group.items.length === 0 ? null : (
                  <div key={g} role="presentation" className={styles.group}>
                    {(group.label != null || group.action != null) && (
                      <div className={styles.groupHead} role="presentation">
                        <span>{group.label}</span>
                        {group.action != null && (
                          <span
                            className={styles.action}
                            onMouseDown={keepFocus}
                            onClick={afterAction}
                          >
                            {group.action}
                          </span>
                        )}
                      </div>
                    )}
                    {group.items.map((item, j) => {
                      const i = starts[g]! + j;
                      const isActive = i === activeIndex;
                      return (
                        <div
                          key={item.id}
                          id={optionId(i)}
                          data-index={i}
                          role="option"
                          aria-selected={isActive}
                          className={mergeClasses(styles.item, isActive && styles.active)}
                          // Movement, not hover: a pointer resting on the list
                          // mustn't take the row from fresh results.
                          onMouseMove={() => !isActive && setActiveId(item.id)}
                          onMouseDown={keepFocus}
                          onClick={() => onSelect(item)}
                        >
                          {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
                          <span className={styles.itemText}>
                            <span className={styles.title}>{item.title}</span>
                            {item.subtitle && (
                              <span className={styles.subtitle}>{item.subtitle}</span>
                            )}
                            {item.excerpt && <span className={styles.excerpt}>{item.excerpt}</span>}
                          </span>
                          {item.action && (
                            <span className={styles.action} onClick={afterAction}>
                              {item.action}
                            </span>
                          )}
                          <ArrowEnterLeftRegular
                            className={mergeClasses(styles.enter, isActive && styles.enterVisible)}
                          />
                        </div>
                      );
                    })}
                  </div>
                ),
              )}
        </div>

        <div className={styles.footer}>
          <span className={styles.hints}>
            <span className={styles.hint}>
              <kbd className={styles.kbd}>↑</kbd>
              <kbd className={styles.kbd}>↓</kbd>
              {strings.commandMove}
            </span>
            <span className={styles.hint}>
              <kbd className={styles.kbd}>Enter</kbd>
              {strings.commandOpen}
            </span>
            <span className={styles.hint}>
              <kbd className={styles.kbd}>Esc</kbd>
              {strings.commandClose}
            </span>
          </span>
          {status}
        </div>
      </DialogSurface>
    </Dialog>
  );
}
