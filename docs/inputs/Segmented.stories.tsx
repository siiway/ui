import type { Meta } from "@storybook/react-vite";
import { LinkRegular, LockClosedRegular } from "@fluentui/react-icons";
import { Segmented } from "@siiway/ui-react";
import { useState } from "react";
import { useText } from "../helpers";
import descriptionMd from "./SegmentedDescription.md?raw";

export const Default = () => {
  const t = useText();
  const [view, setView] = useState<"list" | "grid" | "board">("list");
  return (
    <Segmented
      label={t("View", "视图")}
      value={view}
      onChange={setView}
      options={[
        { value: "list", label: t("List", "列表") },
        { value: "grid", label: t("Grid", "网格") },
        { value: "board", label: t("Board", "看板") },
      ]}
    />
  );
};

export const Brand = () => {
  const t = useText();
  const [access, setAccess] = useState<boolean | null>(null);
  return (
    <Segmented
      label={t("Access", "访问")}
      value={access}
      onChange={setAccess}
      options={[
        { value: true, label: t("Allow", "允许"), brand: true },
        { value: false, label: t("Deny", "拒绝") },
      ]}
    />
  );
};

Brand.parameters = {
  docs: {
    description: {
      story:
        "`brand` fills an option with the accent when it's selected. With `value={null}`, nothing is selected yet. Values can be booleans as well as strings.",
    },
  },
};

export const Icons = () => {
  const t = useText();
  const [type, setType] = useState("public");
  return (
    <Segmented
      label={t("Link type", "链接类型")}
      value={type}
      onChange={setType}
      options={[
        { value: "public", label: t("Public", "公开"), content: <LinkRegular /> },
        { value: "private", label: t("Private", "私有"), content: <LockClosedRegular /> },
      ]}
    />
  );
};

Icons.parameters = {
  docs: {
    description: {
      story:
        "`content` shows in place of an option's `label`, which then names it for screen readers.",
    },
  },
};

export const Fill = () => {
  const t = useText();
  const [view, setView] = useState("list");
  return (
    <div style={{ maxWidth: 360 }}>
      <Segmented
        label={t("View", "视图")}
        value={view}
        onChange={setView}
        fill
        options={[
          { value: "list", label: t("List", "列表") },
          { value: "grid", label: t("Grid", "网格") },
        ]}
      />
    </div>
  );
};

Fill.parameters = {
  docs: { description: { story: "`fill` stretches to the container, in equal segments." } },
};

export const Disabled = () => {
  const t = useText();
  return (
    <Segmented
      label={t("View", "视图")}
      value="list"
      onChange={() => {}}
      disabled
      options={[
        { value: "list", label: t("List", "列表") },
        { value: "grid", label: t("Grid", "网格") },
      ]}
    />
  );
};

const meta = {
  title: "Inputs/Segmented",
  component: Segmented,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
