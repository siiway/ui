import type { Meta } from "@storybook/react-vite";
import { PrevNext } from "@siiway/ui-react";
import { Demo, useText } from "../helpers";
import descriptionMd from "./PrevNextDescription.md?raw";

export const Default = () => {
  const t = useText();
  return (
    <Demo>
      <PrevNext
        prev={{ label: t("Install", "安装"), to: "/docs/install" }}
        next={{ label: t("Sign-in", "登录"), to: "/docs/sign-in" }}
      />
    </Demo>
  );
};

export const FirstPage = () => {
  const t = useText();
  return (
    <Demo>
      <PrevNext next={{ label: t("Install", "安装"), to: "/docs/install" }} />
    </Demo>
  );
};

FirstPage.parameters = {
  docs: {
    description: {
      story: "On the first page, pass only `next`. Its card keeps to the right-hand column.",
    },
  },
};

export const LastPage = () => {
  const t = useText();
  return (
    <Demo>
      <PrevNext prev={{ label: t("Webhooks", "Webhook"), to: "/docs/webhooks" }} />
    </Demo>
  );
};

LastPage.parameters = {
  docs: { description: { story: "On the last page, pass only `prev`." } },
};

const meta = {
  title: "Navigation/PrevNext",
  component: PrevNext,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
