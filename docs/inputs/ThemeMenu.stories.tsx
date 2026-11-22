import type { Meta } from "@storybook/react-vite";
import { Text } from "@fluentui/react-components";
import { ThemeMenu, type ThemeMode } from "@siiway/ui-react";
import { useState } from "react";
import { Demo } from "../helpers";
import descriptionMd from "./ThemeMenuDescription.md?raw";

export const Default = () => {
  const [mode, setMode] = useState<ThemeMode>("system");
  return (
    <Demo layout="row">
      <ThemeMenu value={mode} onChange={setMode} />
      <Text size={200} font="monospace">
        {mode}
      </Text>
    </Demo>
  );
};

const meta = {
  title: "Inputs/ThemeMenu",
  component: ThemeMenu,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
