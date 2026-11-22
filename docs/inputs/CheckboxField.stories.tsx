import type { Meta } from "@storybook/react-vite";
import { CheckboxField } from "@siiway/ui-react";
import { useState } from "react";
import { useText } from "../helpers";
import descriptionMd from "./CheckboxFieldDescription.md?raw";

export const Default = () => {
  const t = useText();
  const [notify, setNotify] = useState(true);
  return (
    <CheckboxField
      label={t("Email me about sign-ins", "登录时发邮件通知我")}
      hint={t("From new devices only.", "仅限新设备。")}
      checked={notify}
      onChange={setNotify}
    />
  );
};

export const Disabled = () => {
  const t = useText();
  return (
    <CheckboxField
      label={t("Require two-step sign-in", "要求两步登录")}
      hint={t("Set by your organization.", "由你的组织设置。")}
      checked
      onChange={() => {}}
      disabled
    />
  );
};

Disabled.parameters = {
  docs: {
    description: {
      story: "`disabled` shows the state but doesn't let it change.",
    },
  },
};

const meta = {
  title: "Inputs/CheckboxField",
  component: CheckboxField,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
