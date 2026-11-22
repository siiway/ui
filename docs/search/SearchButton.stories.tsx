import type { Meta } from "@storybook/react-vite";
import { Text, makeStyles } from "@fluentui/react-components";
import { SearchButton } from "@siiway/ui-react";
import { useState } from "react";
import { Demo, useText } from "../helpers";
import descriptionMd from "./SearchButtonDescription.md?raw";

export const Default = () => {
  const t = useText();
  const [clicks, setClicks] = useState(0);
  return (
    <Demo layout="stack">
      <SearchButton onClick={() => setClicks((n) => n + 1)} />
      <Text size={200} font="monospace">
        {t(`Opened ${clicks} times`, `已打开 ${clicks} 次`)}
      </Text>
    </Demo>
  );
};

const useStyles = makeStyles({ sidebar: { width: "100%" } });

export const Sidebar = () => {
  const t = useText();
  const styles = useStyles();
  return (
    <Demo maxWidth={320}>
      <SearchButton
        onClick={() => {}}
        label={t("Search pages and settings", "搜索页面和设置")}
        className={styles.sidebar}
      />
    </Demo>
  );
};

Sidebar.parameters = {
  docs: {
    description: {
      story:
        'It\'s 240px wide: in a sidebar, set `width: "100%"` through `className`. `label` changes the text in it.',
    },
  },
};

export const NoShortcut = () => {
  return <SearchButton onClick={() => {}} shortcut={false} />;
};

NoShortcut.parameters = {
  docs: {
    description: { story: "`shortcut={false}` hides the hint, where no shortcut opens search." },
  },
};

const meta = {
  title: "Search/SearchButton",
  component: SearchButton,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
