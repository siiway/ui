// Promise-based confirmation dialog for one-click destructive actions:
//
//   const { confirm, confirmDialog } = useConfirm();
//   if (!(await confirm({ title, body, confirmLabel }))) return;
//   ...
//   return <>{...}{confirmDialog}</>;
//
// One dialog per page, reused for every action on it.

import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { useUiStrings } from "../provider/context.js";

const useStyles = makeStyles({
  danger: {
    background: tokens.colorPaletteRedBackground3,
    ":hover": { background: tokens.colorPaletteRedForeground1 },
    ":hover:active": { background: tokens.colorPaletteRedForeground1 },
  },
});

/** What `confirm` asks. */
export interface ConfirmOptions {
  /** The question, as the dialog's title. */
  title: string;
  /** More detail under the title. */
  body?: ReactNode;
  /** Label of the confirming button, e.g. "Remove". */
  confirmLabel: string;
}

/**
 * Asks a yes-or-no question in a dialog and waits for the answer. Render
 * `confirmDialog` once, anywhere in the component.
 */
export function useConfirm() {
  const styles = useStyles();
  const strings = useUiStrings();
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const confirm = useCallback((next: ConfirmOptions) => {
    // A second request while one is open answers the first with "no".
    resolver.current?.(false);
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (ok: boolean) => {
    resolver.current?.(ok);
    resolver.current = null;
    setOptions(null);
  };

  const confirmDialog = (
    <Dialog
      open={options !== null}
      onOpenChange={(_, d) => {
        if (!d.open) close(false);
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{options?.title}</DialogTitle>
          {options?.body && <DialogContent>{options.body}</DialogContent>}
          <DialogActions>
            <Button onClick={() => close(false)}>{strings.cancel}</Button>
            <Button appearance="primary" className={styles.danger} onClick={() => close(true)}>
              {options?.confirmLabel}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );

  return {
    /** Opens the dialog. Resolves to `true` when confirmed and `false` when
     *  cancelled or closed. A second call while it's open answers the first
     *  with `false`. */
    confirm,
    /** The dialog. Render it once. */
    confirmDialog,
  };
}
