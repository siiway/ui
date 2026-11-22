import type { Meta } from "@storybook/react-vite";
import { Text, makeStyles, tokens } from "@fluentui/react-components";
import { StatusPage } from "@siiway/ui-react";
import { useText } from "../helpers";
import descriptionMd from "./StatusPageDescription.md?raw";

const useStyles = makeStyles({
  code: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: "72px",
    lineHeight: 1,
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: "-2px",
    color: tokens.colorBrandForeground1,
  },
});

export const Default = () => {
  const t = useText();
  const styles = useStyles();
  return (
    <StatusPage
      mark={<Text className={styles.code}>404</Text>}
      title={t("Page not found", "找不到页面")}
      description={t(
        "The page may have moved, or the link is wrong.",
        "页面可能已移动，或者链接有误。",
      )}
      back={t("Go back", "返回")}
      primary={{ label: t("Home", "首页"), to: "/" }}
    />
  );
};

export const BrandAndHint = () => {
  const t = useText();
  const styles = useStyles();
  return (
    <StatusPage
      brand={{ name: "SiiWay", iconUrl: "https://icons.siiway.org/siiway/icon.svg" }}
      mark={<Text className={styles.code}>404</Text>}
      title={t("Page not found", "找不到页面")}
      description={t(
        "The page may have moved, or the link is wrong.",
        "页面可能已移动，或者链接有误。",
      )}
      hint="/docs/sign-in/oath"
      primary={{ label: t("Home", "首页"), to: "/" }}
    />
  );
};

BrandAndHint.parameters = {
  docs: {
    description: {
      story:
        "`brand` shows the site small above the mark, for a page shown outside your layout. `hint` adds a detail in monospace, such as the path that wasn't found.",
    },
  },
};

export const Links = () => {
  const t = useText();
  const styles = useStyles();
  return (
    <StatusPage
      mark={<Text className={styles.code}>404</Text>}
      title={t("Page not found", "找不到页面")}
      description={t(
        "The page may have moved, or the link is wrong.",
        "页面可能已移动，或者链接有误。",
      )}
      back={t("Go back", "返回")}
      secondary={[{ label: t("Search", "搜索"), to: "/search" }]}
      primary={{ label: t("Home", "首页"), to: "/" }}
      linksLabel={t("You might have been looking for", "你也许在找")}
      links={[
        { label: t("Sign in with OAuth", "使用 OAuth 登录"), to: "/docs/sign-in/oauth" },
        { label: t("Sign-in", "登录"), to: "/docs/sign-in" },
      ]}
    />
  );
};

Links.parameters = {
  docs: {
    description: {
      story:
        '`secondary` adds buttons between "back" and the main one. `links` lists the pages the reader may have meant, under `linksLabel`.',
    },
  },
};

const meta = {
  title: "Page structure/StatusPage",
  component: StatusPage,
  // A whole page: see fullPage in .storybook/preview.tsx.
  parameters: { fullPage: true, docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
