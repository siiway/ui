// "On this page": the page's headings beside it, with the one being read
// marked as the page scrolls. A click scrolls to the heading and puts it in
// the URL's hash, without going through the router (which would race the
// scroll). To keep it in view as the page scrolls, give it a className that
// makes it sticky and scroll on its own; it then keeps the marked heading in
// sight within itself.

import { Text, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useUiStrings } from "../provider/context.js";
import { TOP_BAR_HEIGHT } from "./TopBar.js";

const useStyles = makeStyles({
  root: { fontSize: "13px", boxSizing: "border-box" },
  heading: {
    display: "block",
    margin: 0,
    padding: "0 0 8px 12px",
    fontSize: "12px",
    fontWeight: tokens.fontWeightRegular,
    lineHeight: "16px",
    color: tokens.colorNeutralForeground3,
  },
  list: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  link: {
    display: "block",
    marginLeft: "-1px",
    padding: "4px 12px",
    lineHeight: "18px",
    borderLeft: "2px solid transparent",
    color: tokens.colorNeutralForeground3,
    textDecoration: "none",
    cursor: "pointer",
    ":hover": { color: tokens.colorNeutralForeground1 },
    "& code": {
      fontFamily: tokens.fontFamilyMonospace,
      fontSize: "0.92em",
      backgroundColor: tokens.colorNeutralBackground3,
      padding: "1px 5px",
      borderRadius: tokens.borderRadiusSmall,
    },
  },
  active: {
    borderLeftColor: tokens.colorNeutralForeground1,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightMedium,
  },
});

export interface OutlineItem {
  /** The heading's element id. */
  id: string;
  /** The heading's text. */
  label: ReactNode;
  /** The heading's level: 2 for an h2. Deeper levels are indented. */
  depth: number;
  /** The headings under this one, listed after it. */
  children?: OutlineItem[];
}

export interface OutlineProps {
  /** The page's headings, in order: `{ id, label, depth, children? }`. */
  items: OutlineItem[];
  /** The heading above the list. Defaults to the library's "On this page". */
  label?: string;
  /** The headings' language, when it isn't the page's. */
  lang?: string;
  /** To keep it in view, make it sticky and let it scroll on its own here. */
  className?: string;
}

export function Outline({ items, label, lang, className }: OutlineProps) {
  const styles = useStyles();
  const strings = useUiStrings();
  const rootRef = useRef<HTMLElement>(null);
  const links = useRef(new Map<string, HTMLAnchorElement>());
  const flat = useMemo(() => flatten(items), [items]);
  const ids = useMemo(() => flat.map((item) => item.id), [flat]);
  const top = Math.min(...flat.map((item) => item.depth));
  const [active, snap] = useActiveHeading(ids);
  const name = label ?? strings.onThisPage;

  // Keep the marked heading in sight, when the outline scrolls on its own.
  useEffect(() => {
    const link = active ? links.current.get(active) : undefined;
    const root = rootRef.current;
    if (!link || !root) return;
    const at = link.getBoundingClientRect();
    const box = root.getBoundingClientRect();
    if (at.top < box.top + 24 || at.bottom > box.bottom - 24) {
      link.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [active]);

  const go = useCallback(
    (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      snap(id);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      const url = new URL(window.location.href);
      url.hash = id;
      window.history.replaceState(window.history.state, "", url);
    },
    [snap],
  );

  // A page without headings keeps the outline's place in the layout, empty.
  if (!flat.length) return <div className={mergeClasses(styles.root, className)} />;

  return (
    <nav ref={rootRef} aria-label={name} className={mergeClasses(styles.root, className)}>
      <Text as="h2" className={styles.heading}>
        {name}
      </Text>
      <ul className={styles.list} lang={lang}>
        {flat.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.depth - top) * 12}px` }}>
            <a
              href={`#${item.id}`}
              ref={(el) => {
                if (el) links.current.set(item.id, el);
                else links.current.delete(item.id);
              }}
              aria-current={active === item.id ? "location" : undefined}
              className={mergeClasses(styles.link, active === item.id && styles.active)}
              onClick={go(item.id)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function flatten(items: OutlineItem[]): OutlineItem[] {
  return items.flatMap((item) => [item, ...flatten(item.children ?? [])]);
}

// The heading being read: the topmost one in the upper part of the window,
// or, between headings, the last one above it. A click marks its heading at
// once and holds the mark while the smooth scroll runs, which would
// otherwise move it through the headings in between.
function useActiveHeading(ids: string[]): [string | null, (id: string) => void] {
  const key = ids.join("\n");
  // The mark belongs to one page's headings; on another page, it's their first.
  const [mark, setMark] = useState<{ key: string; id: string | null }>({
    key,
    id: ids[0] ?? null,
  });
  const active = mark.key === key ? mark.id : (ids[0] ?? null);
  const holdUntil = useRef(0);

  useEffect(() => {
    const headings = key
      .split("\n")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!headings.length) return;
    const visible = new Map<string, IntersectionObserverEntry>();
    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < holdUntil.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry);
          else visible.delete(entry.target.id);
        }
        let id: string | undefined;
        if (visible.size) {
          id = [...visible.values()].sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0]!.target.id;
        } else {
          for (const h of headings) if (h.getBoundingClientRect().top < 100) id = h.id;
        }
        if (id) setMark({ key, id });
      },
      // Below the top bar, down to a little under half the window.
      { rootMargin: `-${TOP_BAR_HEIGHT + 12}px 0px -55% 0px`, threshold: [0, 1] },
    );
    for (const h of headings) observer.observe(h);
    return () => observer.disconnect();
  }, [key]);

  const snap = useCallback(
    (id: string) => {
      setMark({ key, id });
      holdUntil.current = Date.now() + 700;
    },
    [key],
  );

  return [active, snap];
}
