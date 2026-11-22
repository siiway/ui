import type { Meta } from "@storybook/react-vite";
import { Text } from "@fluentui/react-components";
import { CopyButton, CopyIdText, CopyIdTrigger } from "@siiway/ui-react";
import { useText } from "../helpers";
import descriptionMd from "./CopyDescription.md?raw";

export const Default = () => {
  return <CopyButton text="app_7f3a9c" />;
};

export const Label = () => {
  const t = useText();
  return <CopyButton text="app_7f3a9c" label={t("Copy client ID", "复制客户端 ID")} />;
};

Label.parameters = {
  docs: {
    description: {
      story: '`label` names the button and its tooltip in place of the library\'s "Copy".',
    },
  },
};

export const Trigger = () => {
  const t = useText();
  return (
    <CopyIdTrigger
      id="team_42"
      label={t("Copy team ID", "复制团队 ID")}
      copiedLabel={t("Copied team ID", "已复制团队 ID")}
    >
      <Text weight="semibold">Platform</Text>
    </CopyIdTrigger>
  );
};

Trigger.parameters = {
  docs: {
    description: {
      story:
        '`CopyIdTrigger` makes its children copy `id` on click. `copiedLabel` says what was copied, in place of "Copied!".',
    },
  },
};

export const IdText = () => {
  const t = useText();
  return <CopyIdText id="user_ada" label={t("Copy user ID", "复制用户 ID")} />;
};

IdText.parameters = {
  docs: {
    description: {
      story: "`CopyIdText` shows the ID in monospace with a copy icon, and copies it on click.",
    },
  },
};

const meta = {
  title: "Copy/Copy buttons",
  component: CopyButton,
  subcomponents: { CopyIdTrigger, CopyIdText },
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
