import type { Meta } from "@storybook/react-vite";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@fluentui/react-components";
import {
  SkeletonSettingsCard,
  SkeletonSettingsPage,
  SkeletonStatCards,
  SkeletonTableBodyRows,
  SkeletonTableRows,
} from "@siiway/ui-react";
import { useText } from "../helpers";
import descriptionMd from "./SkeletonsDescription.md?raw";

export const Default = () => {
  return <SkeletonSettingsPage cards={[2, 1]} />;
};

export const Form = () => {
  return <SkeletonSettingsCard rows={2} form />;
};

Form.parameters = {
  docs: {
    description: {
      story:
        "`SkeletonSettingsCard` is one card. With `form`, its rows are label-over-input fields.",
    },
  },
};

export const StatCards = () => {
  return <SkeletonStatCards count={3} />;
};

StatCards.parameters = {
  docs: { description: { story: "`SkeletonStatCards` stands in for metric tiles." } },
};

export const TableRows = () => {
  return <SkeletonTableRows rows={3} cols={3} />;
};

TableRows.parameters = {
  docs: { description: { story: "`SkeletonTableRows` goes in place of a whole table." } },
};

export const TableBodyRows = () => {
  const t = useText();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>{t("Name", "名称")}</TableHeaderCell>
          <TableHeaderCell>{t("Role", "角色")}</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
          <TableCell>{t("Owner", "所有者")}</TableCell>
        </TableRow>
        <SkeletonTableBodyRows rows={2} cols={2} />
      </TableBody>
    </Table>
  );
};

TableBodyRows.parameters = {
  docs: {
    description: {
      story:
        "`SkeletonTableBodyRows` goes inside a `TableBody`, under the rows already there, so each bar sits under its column.",
    },
  },
};

const meta = {
  title: "Lists and data/Skeletons",
  component: SkeletonSettingsPage,
  subcomponents: {
    SkeletonSettingsCard,
    SkeletonStatCards,
    SkeletonTableRows,
    SkeletonTableBodyRows,
  },
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
