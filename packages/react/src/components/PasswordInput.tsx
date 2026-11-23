// Password field with a show/hide toggle. Drop-in replacement for
// <Input type="password">; all other InputProps pass through.

import { Button, Input, Tooltip, makeStyles, mergeClasses } from "@fluentui/react-components";
import type { InputProps } from "@fluentui/react-components";
import { EyeOffRegular, EyeRegular } from "@fluentui/react-icons";
import { useState } from "react";
import { useUiStrings } from "../provider/context.js";

const useStyles = makeStyles({
  // Edge draws its own reveal button in a password field, and a clear button
  // once the text shows, beside the toggle here. Other browsers reject these
  // selectors, and Griffel logs each rejected rule in development: @supports
  // keeps the rules from them.
  root: {
    "@supports selector(::-ms-reveal)": {
      "& input::-ms-reveal": { display: "none" },
      "& input::-ms-clear": { display: "none" },
    },
  },
});

export function PasswordInput(props: Omit<InputProps, "type">) {
  const styles = useStyles();
  const strings = useUiStrings();
  const [visible, setVisible] = useState(false);
  return (
    <Input
      {...props}
      className={mergeClasses(styles.root, props.className)}
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
