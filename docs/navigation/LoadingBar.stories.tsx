import type { Meta } from "@storybook/react-vite";
import { Button } from "@fluentui/react-components";
import { LoadingBar } from "@siiway/ui-react";
import { useEffect, useState } from "react";
import { Demo, useText } from "../helpers";
import descriptionMd from "./LoadingBarDescription.md?raw";

// The bar runs across the top of the window, as it would in an app.
export const Default = () => {
  const t = useText();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading) return;
    const done = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(done);
  }, [loading]);
  return (
    <Demo layout="row">
      <LoadingBar active={loading} />
      <Button onClick={() => setLoading(true)} disabled={loading}>
        {t("Load a page", "加载页面")}
      </Button>
      <Button onClick={() => setLoading(false)} disabled={!loading}>
        {t("Finish now", "立即完成")}
      </Button>
    </Demo>
  );
};

const meta = {
  title: "Navigation/LoadingBar",
  component: LoadingBar,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
