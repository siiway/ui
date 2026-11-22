// System / Light / Dark switch: the segmented control in Prism's account menu
// and Vellum's theme popover. Icons only; each segment is named for screen
// readers and in its tooltip. Where the app keeps the choice, and how it
// resolves "system", is up to the app.

import { DesktopRegular, WeatherMoonRegular, WeatherSunnyRegular } from "@fluentui/react-icons";
import type { ThemeMode } from "@siiway/ui-core";
import { useUiStrings } from "../provider/context.js";
import { Segmented } from "./Segmented.js";

export interface ThemeSwitchProps {
  /** The selected mode: `system`, `light` or `dark`. */
  value: ThemeMode;
  /** Called with the picked mode. */
  onChange: (mode: ThemeMode) => void;
  /** Names the group for screen readers; defaults to the library's "Theme". */
  label?: string;
  /** Disables all three segments. */
  disabled?: boolean;
  className?: string;
}

export function ThemeSwitch({ value, onChange, label, disabled, className }: ThemeSwitchProps) {
  const strings = useUiStrings();
  return (
    <Segmented<ThemeMode>
      label={label ?? strings.theme}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
      options={[
        { value: "system", label: strings.themeSystem, content: <DesktopRegular /> },
        { value: "light", label: strings.themeLight, content: <WeatherSunnyRegular /> },
        { value: "dark", label: strings.themeDark, content: <WeatherMoonRegular /> },
      ]}
    />
  );
}
