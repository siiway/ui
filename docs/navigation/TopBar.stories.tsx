import type { Meta } from "@storybook/react-vite";
import { makeStyles } from "@fluentui/react-components";
import { SearchButton, ThemeMenu, TopBar, type ThemeMode } from "@siiway/ui-react";
import { useState } from "react";
import { useText } from "../helpers";
import descriptionMd from "./TopBarDescription.md?raw";

// The canvas is narrower than a window: a shorter search button leaves the
// brand room.
const useStyles = makeStyles({ search: { width: "160px" } });

export const Default = () => {
  const t = useText();
  const styles = useStyles();
  const [mode, setMode] = useState<ThemeMode>("system");
  return (
    <TopBar
      brand={{ label: "SiiWay", to: "/", logo: "https://icons.siiway.org/siiway/icon.svg" }}
      links={[
        { label: t("Guide", "指南"), to: "/guide", active: true },
        { label: t("Reference", "参考"), to: "/reference" },
      ]}
      onMenu={() => {}}
    >
      <SearchButton onClick={() => {}} className={styles.search} />
      <ThemeMenu value={mode} onChange={setMode} />
    </TopBar>
  );
};

export const Crumb = () => {
  return (
    <TopBar
      brand={{ label: "SiiWay", to: "/", logo: "https://icons.siiway.org/siiway/icon.svg" }}
      crumb={{ label: "Glint", to: "/glint", logo: "https://icons.siiway.org/glint/icon.svg" }}
    />
  );
};

Crumb.parameters = {
  docs: {
    description: {
      story:
        "`crumb` is a second step after the brand, such as the section or project, with a `logo` of its own.",
    },
  },
};

export const Menu = () => {
  const t = useText();
  return (
    <TopBar
      brand={{ label: "SiiWay", to: "/", logo: "https://icons.siiway.org/siiway/icon.svg" }}
      links={[
        { label: t("Guide", "指南"), to: "/guide" },
        {
          label: t("More", "更多"),
          items: [
            { label: t("Changelog", "更新日志"), to: "/changelog", active: true },
            { label: "GitHub", to: "https://github.com/siiway" },
          ],
        },
      ]}
    />
  );
};

Menu.parameters = {
  docs: {
    description: {
      story:
        "A link with `items` is a menu, active when one of its items is. A full URL in `to` opens in a new tab.",
    },
  },
};

const meta = {
  title: "Navigation/TopBar",
  component: TopBar,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
