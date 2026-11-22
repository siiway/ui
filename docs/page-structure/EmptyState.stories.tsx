import type { Meta } from "@storybook/react-vite";
import { Button } from "@fluentui/react-components";
import { AppsRegular } from "@fluentui/react-icons";
import { EmptyState } from "@siiway/ui-react";
import { useText } from "../helpers";
import descriptionMd from "./EmptyStateDescription.md?raw";

export const Default = () => {
  const t = useText();
  return (
    <EmptyState
      icon={<AppsRegular />}
      title={t("No apps yet", "还没有应用")}
      description={t("Apps you register show up here.", "你注册的应用会显示在这里。")}
    />
  );
};

export const WithAction = () => {
  const t = useText();
  return (
    <EmptyState
      icon={<AppsRegular />}
      title={t("No apps yet", "还没有应用")}
      description={t("Apps you register show up here.", "你注册的应用会显示在这里。")}
      action={<Button appearance="primary">{t("New app", "新建应用")}</Button>}
    />
  );
};

WithAction.parameters = {
  docs: { description: { story: "`action` goes under the text, such as the list's main button." } },
};

const meta = {
  title: "Page structure/EmptyState",
  component: EmptyState,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
