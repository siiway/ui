import type { Meta } from "@storybook/react-vite";
import { DataListSkeleton, type DataListColumn } from "@siiway/ui-react";
import { useText } from "../helpers";
import descriptionMd from "./DataListSkeletonDescription.md?raw";

export const Default = () => {
  const t = useText();
  const columns: DataListColumn[] = [
    { label: t("Name", "名称"), width: "minmax(0, 2fr)" },
    { label: t("Owner", "所有者"), width: "minmax(0, 1fr)", secondary: true },
    { label: t("Members", "成员"), width: "96px", end: true },
  ];
  return <DataListSkeleton columns={columns} linked rows={3} />;
};

export const Avatars = () => {
  const t = useText();
  const columns: DataListColumn[] = [
    { label: t("Name", "名称"), width: "minmax(0, 2fr)" },
    { label: t("Role", "角色"), width: "minmax(0, 1fr)" },
  ];
  return <DataListSkeleton columns={columns} rows={3} icon="circle" />;
};

Avatars.parameters = {
  docs: {
    description: {
      story:
        "`icon` keeps room for an avatar in the first column, `circle` or `square`, as the rows will have.",
    },
  },
};

const meta = {
  title: "Lists and data/DataListSkeleton",
  component: DataListSkeleton,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
