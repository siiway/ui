// The banner on app and team pages that says which authority a site admin is
// acting with (the site override or their own membership), with the button
// that switches. Built on MessageBar's own layout, so a long message moves
// the action under the text and the dismiss stays in the corner rather than
// wrapping onto a line of its own.

import { Button, MessageBar, MessageBarActions, MessageBarBody } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import type { ReactNode } from "react";
import { useUiStrings } from "../provider/context.js";

interface Props {
  /** The banner's colour and icon. */
  intent: "info" | "warning";
  /** The message. */
  children: ReactNode;
  /** A button at the end: the switch, e.g. "Switch to normal view". */
  action?: { label: string; onClick: () => void };
  /** Called by a close button, which shows only when this is set. */
  onDismiss?: () => void;
}

export function ViewBanner({ intent, children, action, onDismiss }: Props) {
  const strings = useUiStrings();
  return (
    <MessageBar intent={intent}>
      <MessageBarBody>{children}</MessageBarBody>
      {(action || onDismiss) && (
        <MessageBarActions
          containerAction={
            onDismiss && (
              <Button
                appearance="transparent"
                size="small"
                icon={<DismissRegular />}
                aria-label={strings.close}
                onClick={onDismiss}
              />
            )
          }
        >
          {action && (
            <Button size="small" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </MessageBarActions>
      )}
    </MessageBar>
  );
}
