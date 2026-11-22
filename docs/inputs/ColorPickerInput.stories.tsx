import type { Meta } from "@storybook/react-vite";
import { Field } from "@fluentui/react-components";
import { ColorPickerInput } from "@siiway/ui-react";
import { useState } from "react";
import { Demo, useText } from "../helpers";
import descriptionMd from "./ColorPickerInputDescription.md?raw";

export const Default = () => {
  const t = useText();
  const [accent, setAccent] = useState<string | null>("#0078d4");
  return (
    <Demo maxWidth={320}>
      <Field label={t("Accent colour", "强调色")}>
        <ColorPickerInput value={accent} onChange={setAccent} />
      </Field>
    </Demo>
  );
};

export const Nullable = () => {
  const t = useText();
  const [linkColor, setLinkColor] = useState<string | null>(null);
  return (
    <Demo maxWidth={320}>
      <Field label={t("Link colour (optional)", "链接颜色（可选）")}>
        <ColorPickerInput value={linkColor} onChange={setLinkColor} nullable />
      </Field>
    </Demo>
  );
};

Nullable.parameters = {
  docs: {
    description: {
      story:
        "With `nullable`, the field may be left empty, giving `null`. A Clear button empties it.",
    },
  },
};

const meta = {
  title: "Inputs/ColorPickerInput",
  component: ColorPickerInput,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
