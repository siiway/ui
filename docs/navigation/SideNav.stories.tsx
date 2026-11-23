import type { Meta } from "@storybook/react-vite";
import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import {
  AppsRegular,
  ArrowLeftRegular,
  HomeRegular,
  KeyRegular,
  PeopleTeamRegular,
  PersonRegular,
  SettingsRegular,
  ShieldRegular,
} from "@fluentui/react-icons";
import { SideNav } from "@siiway/ui-react";
import { useText } from "../helpers";
import descriptionMd from "./SideNavDescription.md?raw";

// Where it sits is the app's layout: here, a bordered column. The stories'
// router knows a pretend location, so clicking an item makes it current.
const useStyles = makeStyles({
  column: {
    width: "240px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
  },
  tall: { height: "360px" },
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
            { label: t("Overview", "概览"), to: "/", icon: <HomeRegular />, end: true },
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
            { label: t("Introduction", "简介"), to: "/docs", end: true },
            { label: t("Install", "安装"), to: "/docs/install" },
          ],
        },
        {
          label: t("Guides", "指南"),
          items: [
            {
              label: t("Sign-in", "登录"),
              to: "/docs/sign-in",
              end: true,
              items: [
                { label: "OAuth", to: "/docs/sign-in/oauth" },
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
  location: "/docs/sign-in/oauth",
  docs: {
    description: {
      story:
        "An item's `items` go under it, indented. An item without `to`, such as Webhooks here, is a heading for its `items`. Sign-in has `end`, so it isn't current on the pages under it.",
    },
  },
};

export const BottomGroup = () => {
  const t = useText();
  const styles = useStyles();
  return (
    <SideNav
      label={t("Main", "主导航")}
      className={mergeClasses(styles.column, styles.tall)}
      groups={[
        {
          items: [
            { label: t("Overview", "概览"), to: "/", icon: <HomeRegular />, end: true },
            { label: t("Apps", "应用"), to: "/apps", icon: <AppsRegular /> },
          ],
        },
        {
          placement: "end",
          items: [{ label: t("Admin panel", "管理面板"), to: "/admin", icon: <ShieldRegular /> }],
        },
      ]}
    />
  );
};

BottomGroup.parameters = {
  docs: {
    description: {
      story:
        'A group with `placement: "end"` sits at the bottom of a nav that has room to spare: give the nav a height, such as the window\'s.',
    },
  },
};

export const MutedItem = () => {
  const t = useText();
  const styles = useStyles();
  return (
    <SideNav
      label={t("Admin", "管理")}
      className={styles.column}
      groups={[
        {
          items: [
            {
              label: t("Back to account", "返回账户"),
              to: "/",
              icon: <ArrowLeftRegular />,
              end: true,
              muted: true,
            },
          ],
        },
        {
          label: t("Admin", "管理"),
          items: [
            { label: t("Users", "用户"), to: "/admin/users", icon: <PersonRegular /> },
            { label: t("Apps", "应用"), to: "/admin/apps", icon: <AppsRegular /> },
            { label: t("Keys", "密钥"), to: "/admin/keys", icon: <KeyRegular /> },
          ],
        },
      ]}
    />
  );
};

MutedItem.parameters = {
  location: "/admin/users",
  docs: {
    description: {
      story:
        "A `muted` item is grey, at regular weight: for a way out of a section, such as back from the admin pages.",
    },
  },
};

const meta = {
  title: "Navigation/SideNav",
  component: SideNav,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
