import type { Meta } from "@storybook/react-vite";
import { Button, Field, Input } from "@fluentui/react-components";
import { FormPage } from "@siiway/ui-react";
import { useText } from "../helpers";
import descriptionMd from "./FormPageDescription.md?raw";

export const Default = () => {
  const t = useText();
  return (
    <FormPage
      backTo="/apps"
      backLabel={t("Apps", "应用")}
      title={t("New app", "新建应用")}
      subtitle={t("Register an app that signs people in here.", "注册一个在本站登录用户的应用。")}
      actions={
        <Button appearance="primary" type="submit">
          {t("Create", "创建")}
        </Button>
      }
      onSubmit={() => {}}
    >
      <Field label={t("Name", "名称")} required>
        <Input />
      </Field>
    </FormPage>
  );
};

export const Result = () => {
  const t = useText();
  return (
    <FormPage backTo="/apps" backLabel={t("Apps", "应用")} title={t("App created", "应用已创建")}>
      <Field label={t("Client ID", "客户端 ID")}>
        <Input value="app_7f3a9c" readOnly />
      </Field>
    </FormPage>
  );
};

Result.parameters = {
  docs: {
    description: {
      story: "Without `actions` the card has no foot, for a card that shows the result once done.",
    },
  },
};

const meta = {
  title: "Page structure/FormPage",
  component: FormPage,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
