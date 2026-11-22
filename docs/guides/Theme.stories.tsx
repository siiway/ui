import type { Meta } from "@storybook/react-vite";
import { Button, Link, makeStyles, Switch, tokens } from "@fluentui/react-components";
import { ColorPickerInput, Segmented, UiProvider, useUiScheme } from "@siiway/ui-react";
import { useState } from "react";
import { Demo, useText } from "../helpers";

// The theme page's demo: the same controls in any accent, in its own
// provider so the docs page keeps its own.

const SWATCHES = ["#0078d4", "#8a3ffc", "#107c10", "#c4314b", "#ca5010"];

const useStyles = makeStyles({
  controls: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" },
  swatch: {
    width: "24px",
    height: "24px",
    padding: 0,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusCircular,
    cursor: "pointer",
  },
  preview: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "16px",
    marginTop: "16px",
    padding: "16px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
  },
});

export const Accent = () => {
  const t = useText();
  const scheme = useUiScheme();
  const styles = useStyles();
  const [accent, setAccent] = useState<string | null>("#8a3ffc");
  const [on, setOn] = useState(true);
  const [size, setSize] = useState("m");
  return (
    <Demo>
      <div className={styles.controls}>
        {SWATCHES.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={color}
            className={styles.swatch}
            style={{ backgroundColor: color }}
            onClick={() => setAccent(color)}
          />
        ))}
        <div style={{ width: 200 }}>
          <ColorPickerInput value={accent} onChange={setAccent} nullable />
        </div>
      </div>
      <UiProvider
        scheme={scheme}
        accent={accent}
        className={styles.preview}
        style={{ backgroundColor: "transparent" }}
      >
        <Button appearance="primary">{t("Primary", "主要按钮")}</Button>
        <Link href="#accent" onClick={(e) => e.preventDefault()}>
          {t("A link", "一个链接")}
        </Link>
        <Switch checked={on} onChange={(_, d) => setOn(d.checked)} label={t("On", "开")} />
        <Segmented
          label={t("Size", "尺寸")}
          value={size}
          onChange={setSize}
          options={[
            { value: "s", label: "S" },
            { value: "m", label: "M" },
            { value: "l", label: "L" },
          ]}
        />
      </UiProvider>
    </Demo>
  );
};

// Shown on the Theme guide (Theme.mdx), not on a page of its own.
const meta = { title: "Guides/Theme", tags: ["!autodocs"] } satisfies Meta;
export default meta;
