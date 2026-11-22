// Compact segmented radio group: a hairline track with one highlighted
// segment. Used for the account menu's theme and language switches and the
// notification level pickers. A null value highlights nothing, which bulk
// controls use for "mixed". Values may be booleans for a two-way choice.

import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import type { ReactNode } from "react";

const useStyles = makeStyles({
  root: {
    display: "inline-flex",
    padding: "2px",
    gap: "2px",
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    boxSizing: "border-box",
  },
  fill: {
    display: "flex",
    width: "100%",
  },
  segment: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "26px",
    height: "24px",
    padding: "0 6px",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    background: "transparent",
    color: tokens.colorNeutralForeground3,
    fontFamily: "inherit",
    fontSize: "12px",
    whiteSpace: "nowrap",
    cursor: "pointer",
    "& svg": { fontSize: "14px" },
    ":hover": {
      color: tokens.colorNeutralForeground1,
    },
    ":focus-visible": {
      outline: `2px solid ${tokens.colorStrokeFocus2}`,
      outlineOffset: "-2px",
    },
    ":disabled": { cursor: "default", opacity: 0.5 },
  },
  segmentFill: {
    flex: 1,
  },
  active: {
    background: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  // For values that switch something on, so they stand out from "off" at a
  // glance in a long list of pickers.
  activeBrand: {
    background: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    ":hover": { color: tokens.colorBrandForeground2 },
  },
});

export interface SegmentedOption<T extends string | boolean> {
  /** What `onChange` gets when this option is picked. */
  value: T;
  /** The option's text, or its accessible name when `content` is shown. */
  label: string;
  /** Rendered instead of the label, e.g. an icon; the label becomes its name. */
  content?: ReactNode;
  /** Highlight with the accent colour when selected. */
  brand?: boolean;
}

export interface SegmentedProps<T extends string | boolean> {
  /** Names the group for screen readers. */
  label: string;
  /** The selected option's value; `null` selects nothing. */
  value: T | null;
  /** The options, in order: `{ value, label, content?, brand? }`. Values are strings or booleans. */
  options: SegmentedOption<T>[];
  /** Called with the picked option's value. */
  onChange: (value: T) => void;
  /** Stretch to the container width with equal segments. */
  fill?: boolean;
  /** Disables every option. */
  disabled?: boolean;
  className?: string;
}

export function Segmented<T extends string | boolean>({
  label,
  value,
  options,
  onChange,
  fill,
  disabled,
  className,
}: SegmentedProps<T>) {
  const styles = useStyles();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={mergeClasses(styles.root, fill && styles.fill, className)}
    >
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={o.content ? o.label : undefined}
            title={o.content ? o.label : undefined}
            disabled={disabled}
            className={mergeClasses(
              styles.segment,
              fill && styles.segmentFill,
              selected && styles.active,
              selected && o.brand && styles.activeBrand,
            )}
            // Re-picking the current value changes nothing, which matters
            // where a pick saves at once.
            onClick={() => {
              if (!selected) onChange(o.value);
            }}
          >
            {o.content ?? o.label}
          </button>
        );
      })}
    </div>
  );
}
