import type { Meta } from "@storybook/react-vite";
import { Text } from "@fluentui/react-components";
import { ThemeSwitch, type ThemeMode } from "@siiway/ui-react";
import { useState } from "react";
import { Demo } from "../helpers";
import descriptionMd from "./ThemeSwitchDescription.md?raw";

export const Default = () => {
  const [mode, setMode] = useState<ThemeMode>("system");
  return (
    <Demo layout="row">
      <ThemeSwitch value={mode} onChange={setMode} />
      <Text size={200} font="monospace">
        {mode}
      </Text>
    </Demo>
  );
};

export const Disabled = () => <ThemeSwitch value="dark" onChange={() => {}} disabled />;

Disabled.parameters = {
  docs: { description: { story: "`disabled` turns off all three segments." } },
};

const meta = {
  title: "Inputs/ThemeSwitch",
  component: ThemeSwitch,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
