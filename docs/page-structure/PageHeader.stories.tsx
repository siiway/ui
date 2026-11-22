import type { Meta } from "@storybook/react-vite";
import { Button } from "@fluentui/react-components";
import { PageHeader } from "@siiway/ui-react";
import { useText } from "../helpers";
import descriptionMd from "./PageHeaderDescription.md?raw";

export const Default = () => {
  const t = useText();
  return (
    <PageHeader
      title={t("Applications", "应用")}
      subtitle={t("Apps that sign people in with this site.", "通过本站登录用户的应用。")}
    />
  );
};

export const WithActions = () => {
  const t = useText();
  return (
    <PageHeader
      title={t("Applications", "应用")}
      subtitle={t("Apps that sign people in with this site.", "通过本站登录用户的应用。")}
      actions={<Button appearance="primary">{t("New app", "新建应用")}</Button>}
    />
  );
};

WithActions.parameters = {
  docs: {
    description: {
      story: "`actions` sit on the right. On narrow screens they wrap under the title.",
    },
  },
};

const meta = {
  title: "Page structure/PageHeader",
  component: PageHeader,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
