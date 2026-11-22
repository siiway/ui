import type { Meta } from "@storybook/react-vite";
import { Badge, Button } from "@fluentui/react-components";
import { PeopleTeamRegular } from "@fluentui/react-icons";
import {
  DataList,
  DataListLink,
  DataListName,
  DataListRow,
  ListSearch,
  Pagination,
  type DataListColumn,
} from "@siiway/ui-react";
import { useState } from "react";
import { useText } from "../helpers";
import descriptionMd from "./DataListDescription.md?raw";

const TEAMS = [
  { id: "platform", name: "Platform", owner: "Ada", members: 12, owned: true },
  { id: "design", name: "Design", owner: "Grace", members: 4, owned: false },
  { id: "docs", name: "Docs", owner: "Linus", members: 7, owned: false },
];

export const Default = () => {
  const t = useText();
  const [page, setPage] = useState(1);
  const columns: DataListColumn[] = [
    { label: t("Name", "名称"), width: "minmax(0, 2fr)" },
    { label: t("Owner", "所有者"), width: "minmax(0, 1fr)", secondary: true },
    { label: t("Members", "成员"), width: "96px", end: true },
  ];
  return (
    <>
      <DataList columns={columns} linked>
        {TEAMS.map((team) => (
          <DataListRow
            key={team.id}
            to={`/teams/${team.id}`}
            cells={[
              <DataListName
                key="name"
                icon={<PeopleTeamRegular />}
                name={team.name}
                badges={team.owned && <Badge appearance="tint">{t("Owner", "所有者")}</Badge>}
                sub={team.id}
              />,
              team.owner,
              String(team.members),
            ]}
          />
        ))}
      </DataList>
      <Pagination page={page} total={87} pageSize={20} onChange={setPage} />
    </>
  );
};

export const Search = () => {
  const t = useText();
  const [query, setQuery] = useState("");
  const columns: DataListColumn[] = [
    { label: t("Name", "名称"), width: "minmax(0, 1fr)" },
    { label: t("Members", "成员"), width: "96px", end: true },
  ];
  const shown = TEAMS.filter((team) =>
    team.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <ListSearch value={query} onChange={setQuery} placeholder={t("Search teams", "搜索团队")}>
        <Button>{t("New team", "新建团队")}</Button>
      </ListSearch>
      <DataList columns={columns} linked>
        {shown.map((team) => (
          <DataListRow
            key={team.id}
            to={`/teams/${team.id}`}
            cells={[team.name, String(team.members)]}
          />
        ))}
      </DataList>
    </>
  );
};

Search.parameters = {
  docs: {
    description: {
      story:
        "`ListSearch` goes above the list, with buttons or filters beside it as `children`. Type to filter the teams.",
    },
  },
};

export const Selection = () => {
  const t = useText();
  const [selected, setSelected] = useState("design");
  const columns: DataListColumn[] = [
    { label: t("Name", "名称"), width: "minmax(0, 2fr)" },
    { label: t("Owner", "所有者"), width: "minmax(0, 1fr)" },
  ];
  return (
    <DataList columns={columns}>
      {TEAMS.map((team) => (
        <DataListRow
          key={team.id}
          onClick={() => setSelected(team.id)}
          selected={selected === team.id}
          cells={[
            <DataListName key="name" icon={<PeopleTeamRegular />} name={team.name} />,
            <DataListLink key="owner" to={`/users/${team.owner.toLowerCase()}`}>
              {team.owner}
            </DataListLink>,
          ]}
        />
      ))}
    </DataList>
  );
};

Selection.parameters = {
  docs: {
    description: {
      story:
        "Click a row to select it: the rows take `onClick` and `selected` instead of `to`. The owner's name is a `DataListLink`, a link of its own inside the row.",
    },
  },
};

const meta = {
  title: "Lists and data/DataList",
  component: DataList,
  subcomponents: { DataListRow, DataListName, DataListLink, ListSearch, Pagination },
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
