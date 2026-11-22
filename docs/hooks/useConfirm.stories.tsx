import type { Meta } from "@storybook/react-vite";
import { Button, Text } from "@fluentui/react-components";
import { useConfirm } from "@siiway/ui-react";
import { useState } from "react";
import { Demo, useText } from "../helpers";
import descriptionMd from "./useConfirmDescription.md?raw";

export const Default = () => {
  const t = useText();
  const { confirm, confirmDialog } = useConfirm();
  const [answer, setAnswer] = useState("");

  async function remove() {
    const ok = await confirm({
      title: t("Remove Glint?", "移除 Glint？"),
      body: t("People signed in with it are signed out.", "通过它登录的用户会被登出。"),
      confirmLabel: t("Remove", "移除"),
    });
    setAnswer(ok ? t("Removed", "已移除") : t("Kept", "已保留"));
  }

  return (
    <Demo layout="row">
      <Button onClick={remove}>{t("Remove…", "移除…")}</Button>
      <Text>{answer}</Text>
      {confirmDialog}
    </Demo>
  );
};

const meta = {
  title: "Hooks/useConfirm",
  parameters: { docs: { hideArgsTable: true, description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
