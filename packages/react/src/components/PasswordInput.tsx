// Password field with a show/hide toggle. Drop-in replacement for
// <Input type="password">; all other InputProps pass through.

import { Button, Input, Tooltip } from "@fluentui/react-components";
import type { InputProps } from "@fluentui/react-components";
import { EyeOffRegular, EyeRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useUiStrings } from "../provider/context.js";

export function PasswordInput(props: Omit<InputProps, "type">) {
  const strings = useUiStrings();
  const [visible, setVisible] = useState(false);
  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      contentAfter={
        <Tooltip
          content={visible ? strings.hidePassword : strings.showPassword}
          relationship="label"
        >
          <Button
            appearance="transparent"
            size="small"
            icon={visible ? <EyeOffRegular /> : <EyeRegular />}
            onClick={() => setVisible((v) => !v)}
            // Keep the toggle out of the tab order so Tab moves between
            // form fields; the tooltip still labels it for pointer users.
            tabIndex={-1}
          />
        </Tooltip>
      }
    />
  );
}
