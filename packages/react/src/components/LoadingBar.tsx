// A thin brand-coloured bar across the top of the window while the next page
// loads, like NProgress: it creeps towards the end while `active`, then runs
// to the end and fades. Tie `active` to the router's navigation state (React
// Router's `useNavigation().state !== "idle"`, Vellum's `isNavigating`).

import { makeStyles, tokens } from "@fluentui/react-components";
import { useEffect, useState } from "react";

const START = 0.08;
// It never gets past this while loading: the end is for when it's done.
const CAP = 0.9;

const useStyles = makeStyles({
  bar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    zIndex: 1000,
    pointerEvents: "none",
    transformOrigin: "left center",
    backgroundColor: tokens.colorBrandBackground,
    // The fade waits for the bar to reach the end.
    transition: "transform 200ms ease-out, opacity 250ms ease-out 250ms",
  },
});

interface Bar {
  progress: number;
  visible: boolean;
}

export function LoadingBar({
  active,
}: {
  /**
   * True while the next page loads, e.g. React Router's
   * `useNavigation().state !== "idle"`.
   */
  active: boolean;
}) {
  const styles = useStyles();
  const [bar, setBar] = useState<Bar>(() =>
    active ? { progress: START, visible: true } : { progress: 0, visible: false },
  );
  // Start and finish as `active` changes, in the render that sees it. A load
  // that ends before the bar was drawn never shows it.
  const [was, setWas] = useState(active);
  if (active !== was) {
    setWas(active);
    if (active) setBar({ progress: START, visible: true });
    else if (bar.visible) setBar({ progress: 1, visible: false });
  }

  useEffect(() => {
    if (active) {
      // Each step covers part of what's left, so it slows towards the cap.
      let progress = START;
      const tick = setInterval(() => {
        progress = Math.min(CAP, progress + (CAP - progress) * 0.12);
        setBar({ progress, visible: true });
      }, 200);
      return () => clearInterval(tick);
    }
    // Back to the start once it has faded out.
    const reset = setTimeout(
      () => setBar((now) => (now.progress === 0 ? now : { progress: 0, visible: false })),
      500,
    );
    return () => clearTimeout(reset);
  }, [active]);

  return (
    <div
      className={styles.bar}
      style={{ transform: `scaleX(${bar.progress})`, opacity: bar.visible ? 1 : 0 }}
      aria-hidden="true"
    />
  );
}
