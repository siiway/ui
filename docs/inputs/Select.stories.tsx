import type { Meta } from "@storybook/react-vite";
import { Field } from "@fluentui/react-components";
import { Select } from "@siiway/ui-react";
import { useState } from "react";
import { Demo, useText } from "../helpers";
import descriptionMd from "./SelectDescription.md?raw";

export const Default = () => {
  const t = useText();
  const [role, setRole] = useState("member");
  return (
    <Demo maxWidth={320}>
      <Field label={t("Role", "角色")}>
        <Select value={role} onChange={(_, d) => setRole(d.value)}>
          <option value="member">{t("Member", "成员")}</option>
          <option value="admin">{t("Admin", "管理员")}</option>
        </Select>
      </Field>
    </Demo>
  );
};

export const DisabledOption = () => {
  const t = useText();
  const [role, setRole] = useState("member");
  return (
    <Demo maxWidth={320}>
      <Field label={t("Role", "角色")}>
        <Select value={role} onChange={(_, d) => setRole(d.value)}>
          <option value="member">{t("Member", "成员")}</option>
          <option value="admin">{t("Admin", "管理员")}</option>
          <option value="owner" disabled>
            {t("Owner", "所有者")}
          </option>
        </Select>
      </Field>
    </Demo>
  );
};

DisabledOption.parameters = {
  docs: {
    description: {
      story: "An `<option disabled>` shows in the list but can't be picked, as in a native select.",
    },
  },
};

const meta = {
  title: "Inputs/Select",
  component: Select,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
