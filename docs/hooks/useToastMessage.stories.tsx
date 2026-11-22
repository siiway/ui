import type { Meta } from "@storybook/react-vite";
import { Button } from "@fluentui/react-components";
import { SettingsToast, useToastMessage } from "@siiway/ui-react";
import { Demo, useText } from "../helpers";
import descriptionMd from "./useToastMessageDescription.md?raw";

export const Default = () => {
  const t = useText();
  const { message, showMsg } = useToastMessage();
  return (
    <Demo layout="stack">
      <Button onClick={() => showMsg("success", t("Saved.", "已保存。"))}>
        {t("Save", "保存")}
      </Button>
      <div style={{ width: "100%", minHeight: 40 }}>
        <SettingsToast message={message} />
      </div>
    </Demo>
  );
};

export const ErrorMessage = () => {
  const t = useText();
  const { message, showMsg } = useToastMessage();
  return (
    <Demo layout="stack">
      <Button
        onClick={() => showMsg("error", t("Couldn't save: try again.", "保存失败，请重试。"))}
      >
        {t("Save", "保存")}
      </Button>
      <div style={{ width: "100%", minHeight: 40 }}>
        <SettingsToast message={message} />
      </div>
    </Demo>
  );
};

ErrorMessage.storyName = "Error";
ErrorMessage.parameters = {
  docs: {
    description: {
      story:
        'A `type` of `"error"` shows the message as an error. A new message replaces the one showing and starts its own timeout.',
    },
  },
};

const meta = {
  title: "Hooks/useToastMessage",
  parameters: { docs: { hideArgsTable: true, description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
