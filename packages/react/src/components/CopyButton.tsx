// An icon button that copies a value and briefly shows how it went.

import { Button, Tooltip } from "@fluentui/react-components";
import { CheckmarkRegular, CopyRegular, DismissRegular } from "@fluentui/react-icons";
import { useUiStrings } from "../provider/context.js";
import { useCopy } from "../hooks/useCopy.js";

/** An icon button that copies `text`. */
export function CopyButton({
  text,
  label,
}: {
  /** The value to copy. */
  text: string;
  /** The button's tooltip and accessible name. Defaults to the library's "Copy". */
  label?: string;
}) {
  const strings = useUiStrings();
  const { state, copy } = useCopy();
  return (
    <Tooltip
      content={
        state === "copied"
          ? strings.copied
          : state === "failed"
            ? strings.copyFailed
            : (label ?? strings.copy)
      }
      relationship="label"
      withArrow
    >
      <Button
        size="small"
        appearance="subtle"
        icon={
          state === "copied" ? (
            <CheckmarkRegular />
          ) : state === "failed" ? (
            <DismissRegular />
          ) : (
            <CopyRegular />
          )
        }
        onClick={() => void copy(text)}
      />
    </Tooltip>
  );
}
