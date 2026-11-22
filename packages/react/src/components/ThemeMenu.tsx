// The theme switch for a top bar: an icon button (a sun or a moon, for the
// scheme drawn now) opening a small panel with the System / Light / Dark
// switch, as in Vellum's nav bar.

import {
  Button,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Tooltip,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { WeatherMoon20Regular, WeatherSunny20Regular } from "@fluentui/react-icons";
import type { ThemeMode } from "@siiway/ui-core";
import { useState } from "react";
import { useUiScheme, useUiStrings } from "../provider/context.js";
import { ThemeSwitch } from "./ThemeSwitch.js";

const useStyles = makeStyles({
  // PopoverSurface brings a drop-shadow filter (sized for an arrow this
  // panel doesn't have) and a transparent border; this has one soft shadow
  // and a hairline edge instead, like the rest of the floating surfaces.
  panel: {
    padding: "4px",
    minWidth: "220px",
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    filter: "none",
    boxShadow: tokens.shadow8,
    background: tokens.colorNeutralBackground1,
    fontSize: "13px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    minHeight: "36px",
    padding: "0 4px 0 8px",
    color: tokens.colorNeutralForeground2,
  },
});

export interface ThemeMenuProps {
  /** The selected mode: `system`, `light` or `dark`. The icon shows the provider's `scheme`, not this. */
  value: ThemeMode;
  /** Called with the picked mode. */
  onChange: (mode: ThemeMode) => void;
  /** The button's name and the label in its panel. Defaults to the library's "Theme". */
  label?: string;
}

export function ThemeMenu({ value, onChange, label }: ThemeMenuProps) {
  const styles = useStyles();
  const strings = useUiStrings();
  const scheme = useUiScheme();
  const [open, setOpen] = useState(false);
  const name = label ?? strings.theme;
  return (
    <Popover
      open={open}
      onOpenChange={(_, data) => setOpen(data.open)}
      positioning={{ position: "below", align: "end", offset: 6 }}
      trapFocus
    >
      <PopoverTrigger disableButtonEnhancement>
        <Tooltip content={name} relationship="label">
          <Button
            appearance="subtle"
            icon={scheme === "dark" ? <WeatherMoon20Regular /> : <WeatherSunny20Regular />}
          />
        </Tooltip>
      </PopoverTrigger>
      <PopoverSurface className={styles.panel}>
        <div className={styles.row}>
          <span>{name}</span>
          <ThemeSwitch value={value} onChange={onChange} label={name} />
        </div>
      </PopoverSurface>
    </Popover>
  );
}
