import type { Meta } from "@storybook/react-vite";
import { Field } from "@fluentui/react-components";
import { PasswordInput } from "@siiway/ui-react";
import { useState } from "react";
import { Demo, useText } from "../helpers";
import descriptionMd from "./PasswordInputDescription.md?raw";

export const Default = () => {
  const t = useText();
  const [password, setPassword] = useState("correct horse");
  return (
    <Demo maxWidth={320}>
      <Field label={t("Password", "密码")}>
        <PasswordInput value={password} onChange={(_, d) => setPassword(d.value)} />
      </Field>
    </Demo>
  );
};

const meta = {
  title: "Inputs/PasswordInput",
  component: PasswordInput,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
