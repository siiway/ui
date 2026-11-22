import type { Meta } from "@storybook/react-vite";
import { Button } from "@fluentui/react-components";
import { ViewBanner } from "@siiway/ui-react";
import { useState } from "react";
import { useText } from "../helpers";
import descriptionMd from "./ViewBannerDescription.md?raw";

export const Default = () => {
  const t = useText();
  return (
    <ViewBanner intent="info">
      {t("This team is read-only while it moves.", "团队迁移期间只读。")}
    </ViewBanner>
  );
};

export const ActionAndDismiss = () => {
  const t = useText();
  const [open, setOpen] = useState(true);
  if (!open) {
    return <Button onClick={() => setOpen(true)}>{t("Show the banner", "显示横幅")}</Button>;
  }
  return (
    <ViewBanner
      intent="warning"
      action={{ label: t("Leave", "离开"), onClick: () => setOpen(false) }}
      onDismiss={() => setOpen(false)}
    >
      {t("You are viewing this team as a site admin.", "你正以站点管理员身份查看这个团队。")}
    </ViewBanner>
  );
};

ActionAndDismiss.parameters = {
  docs: {
    description: {
      story:
        '`action` adds a button at the end, and `onDismiss` a close button. This one uses `intent="warning"`.',
    },
  },
};

const meta = {
  title: "Page structure/ViewBanner",
  component: ViewBanner,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
