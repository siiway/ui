import type { Meta } from "@storybook/react-vite";
import { Button } from "@fluentui/react-components";
import { GetStartedPanel } from "@siiway/ui-react";
import { useText } from "../helpers";
import descriptionMd from "./GetStartedPanelDescription.md?raw";

function Art() {
  return (
    <svg width="96" height="72" viewBox="0 0 96 72" aria-hidden>
      <rect x="8" y="8" width="80" height="56" rx="10" fill="currentColor" opacity="0.12" />
      <rect x="20" y="22" width="40" height="6" rx="3" fill="currentColor" opacity="0.4" />
      <rect x="20" y="36" width="56" height="6" rx="3" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

export const Default = () => {
  const t = useText();
  return (
    <GetStartedPanel
      art={<Art />}
      title={t("Sign people in to your app", "让用户登录你的应用")}
      description={t(
        "Register an app, then point its OAuth client at this site.",
        "注册一个应用，再把它的 OAuth 客户端指向本站。",
      )}
      action={<Button appearance="primary">{t("New app", "新建应用")}</Button>}
    />
  );
};

export const Steps = () => {
  const t = useText();
  return (
    <GetStartedPanel
      art={<Art />}
      title={t("Sign people in to your app", "让用户登录你的应用")}
      description={t(
        "Register an app, then point its OAuth client at this site.",
        "注册一个应用，再把它的 OAuth 客户端指向本站。",
      )}
      steps={[
        t("Create an app", "创建应用"),
        t("Add a redirect URI", "添加重定向 URI"),
        t("Copy the client ID", "复制客户端 ID"),
      ]}
      action={<Button appearance="primary">{t("New app", "新建应用")}</Button>}
    />
  );
};

Steps.parameters = {
  docs: { description: { story: "`steps` are numbered, between the description and the action." } },
};

const meta = {
  title: "Page structure/GetStartedPanel",
  component: GetStartedPanel,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
