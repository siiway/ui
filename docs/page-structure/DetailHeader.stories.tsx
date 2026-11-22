import type { Meta } from "@storybook/react-vite";
import { Badge, Button } from "@fluentui/react-components";
import { BackButton, BrandMark, DetailHeader } from "@siiway/ui-react";
import { useText } from "../helpers";
import descriptionMd from "./DetailHeaderDescription.md?raw";

export const Default = () => {
  const t = useText();
  return (
    <DetailHeader
      icon={<BrandMark name="Glint" iconUrl="https://icons.siiway.org/glint/icon.svg" size={40} />}
      title="Glint"
      subtitle={t("Shared to-do lists", "共享待办清单")}
    />
  );
};

export const BadgesAndActions = () => {
  const t = useText();
  return (
    <DetailHeader
      icon={<BrandMark name="Glint" iconUrl="https://icons.siiway.org/glint/icon.svg" size={40} />}
      title="Glint"
      badges={<Badge appearance="tint">{t("Verified", "已验证")}</Badge>}
      subtitle={t("Shared to-do lists", "共享待办清单")}
      actions={<Button>{t("Edit", "编辑")}</Button>}
    />
  );
};

BadgesAndActions.parameters = {
  docs: {
    description: {
      story: "`badges` follow the name, and `actions` end the row.",
    },
  },
};

export const WithBackButton = () => {
  const t = useText();
  return (
    <>
      <BackButton to="/apps">{t("Apps", "应用")}</BackButton>
      <DetailHeader
        icon={
          <BrandMark name="Glint" iconUrl="https://icons.siiway.org/glint/icon.svg" size={40} />
        }
        title="Glint"
        subtitle={t("Shared to-do lists", "共享待办清单")}
      />
    </>
  );
};

WithBackButton.parameters = {
  docs: {
    description: {
      story: "`BackButton` goes above the header. `to` is the list's path and `children` its name.",
    },
  },
};

const meta = {
  title: "Page structure/DetailHeader",
  component: DetailHeader,
  subcomponents: { BackButton },
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
