import type { Meta } from "@storybook/react-vite";
import { LabeledLine } from "@siiway/ui-react";
import { useText } from "../helpers";
import descriptionMd from "./LabeledLineDescription.md?raw";

export const Default = () => {
  const t = useText();
  return <LabeledLine label={t("Owner", "所有者")}>Ada</LabeledLine>;
};

export const Mono = () => {
  const t = useText();
  return (
    <LabeledLine label={t("Client ID", "客户端 ID")} mono>
      app_7f3a9c
    </LabeledLine>
  );
};

Mono.parameters = {
  docs: { description: { story: "`mono` sets the value in monospace, for IDs and codes." } },
};

const meta = {
  title: "Page structure/LabeledLine",
  component: LabeledLine,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
