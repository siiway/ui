import type { Meta } from "@storybook/react-vite";
import { makeStyles, tokens } from "@fluentui/react-components";
import {
  AppsRegular,
  HomeRegular,
  PeopleTeamRegular,
  SettingsRegular,
} from "@fluentui/react-icons";
import { SideNav } from "@siiway/ui-react";
import { useText } from "../helpers";
import descriptionMd from "./SideNavDescription.md?raw";

// Where it sits is the app's layout: here, a bordered column.
const useStyles = makeStyles({
  column: {
    width: "240px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
  },
});

export const Default = () => {
  const t = useText();
  const styles = useStyles();
  return (
    <SideNav
      label={t("Main", "主导航")}
      className={styles.column}
      groups={[
        {
          items: [
            { label: t("Overview", "概览"), to: "/", icon: <HomeRegular />, active: true },
            { label: t("Apps", "应用"), to: "/apps", icon: <AppsRegular /> },
            { label: t("Teams", "团队"), to: "/teams", icon: <PeopleTeamRegular /> },
          ],
        },
        {
          label: t("Account", "账户"),
          items: [{ label: t("Settings", "设置"), to: "/settings", icon: <SettingsRegular /> }],
        },
      ]}
    />
  );
};

export const Nested = () => {
  const t = useText();
  const styles = useStyles();
  return (
    <SideNav
      label={t("Documentation", "文档")}
      className={styles.column}
      groups={[
        {
          label: t("Get started", "开始"),
          items: [
            { label: t("Introduction", "简介"), to: "/docs" },
            { label: t("Install", "安装"), to: "/docs/install" },
          ],
        },
        {
          label: t("Guides", "指南"),
          items: [
            {
              label: t("Sign-in", "登录"),
              to: "/docs/sign-in",
              items: [
                { label: "OAuth", to: "/docs/sign-in/oauth", active: true },
                { label: t("Passkeys", "通行密钥"), to: "/docs/sign-in/passkeys" },
              ],
            },
            {
              label: t("Webhooks", "Webhook"),
              items: [{ label: t("Events", "事件"), to: "/docs/webhooks/events" }],
            },
          ],
        },
      ]}
    />
  );
};

Nested.parameters = {
  docs: {
    description: {
      story:
        "An item's `items` go under it, indented. An item without `to`, such as Webhooks here, is a heading for its `items`.",
    },
  },
};

const meta = {
  title: "Navigation/SideNav",
  component: SideNav,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
