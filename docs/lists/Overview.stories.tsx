import type { Meta } from "@storybook/react-vite";
import { Button, Text } from "@fluentui/react-components";
import { AppsRegular, RocketRegular, ShieldRegular } from "@fluentui/react-icons";
import {
  Callout,
  Callouts,
  ListColumn,
  ListGrid,
  ListRow,
  Metric,
  MetricGrid,
  MetricSuffix,
  SectionTitle,
  SummaryList,
  SummaryRow,
} from "@siiway/ui-react";
import { useText } from "../helpers";
import descriptionMd from "./OverviewDescription.md?raw";

export const CalloutsStory = () => {
  const t = useText();
  return (
    <Callouts>
      <Callout
        icon={<ShieldRegular />}
        title={t("Add a passkey", "添加通行密钥")}
        description={t("Sign in without a password.", "无需密码即可登录。")}
        action={<Button size="small">{t("Add", "添加")}</Button>}
      />
      <Callout
        icon={<RocketRegular />}
        title={t("Register an app", "注册应用")}
        description={t("Takes a minute.", "只需一分钟。")}
      />
    </Callouts>
  );
};

CalloutsStory.storyName = "Callouts";
CalloutsStory.parameters = {
  docs: {
    description: {
      story:
        "`Callouts` stacks suggestions. Each `Callout` has an icon, a title, a description and an optional `action`.",
    },
  },
};

export const MetricsStory = () => {
  const t = useText();
  return (
    <>
      <SectionTitle>{t("At a glance", "概览")}</SectionTitle>
      <MetricGrid columns={3}>
        <Metric
          to="/apps"
          label={t("Apps", "应用")}
          value="12"
          caption={t("2 new this week", "本周新增 2 个")}
        />
        <Metric
          to="/teams"
          label={t("Teams", "团队")}
          value={
            <>
              4<MetricSuffix>/ 10</MetricSuffix>
            </>
          }
        />
        <Metric
          to="/tokens"
          label={t("Tokens", "令牌")}
          value="0"
          footer={<Text size={200}>{t("None active", "没有有效令牌")}</Text>}
        />
      </MetricGrid>
    </>
  );
};

MetricsStory.storyName = "Metrics";
MetricsStory.parameters = {
  docs: {
    description: {
      story:
        "`MetricGrid` lays out `Metric` tiles, three or four to a row. `MetricSuffix` is smaller text after a value, and `SectionTitle` heads the section.",
    },
  },
};

export const ListGridStory = () => {
  const t = useText();
  return (
    <ListGrid>
      <ListColumn title={t("Apps", "应用")} to="/apps" count={2} empty={t("No apps", "没有应用")}>
        {[
          <ListRow
            key="glint"
            to="/apps/glint"
            icon={<AppsRegular />}
            label="Glint"
            meta={t("Today", "今天")}
          />,
          <ListRow key="vellum" to="/apps/vellum" icon={<AppsRegular />} label="Vellum" />,
        ]}
      </ListColumn>
      <ListColumn title={t("Links", "链接")} to="/links" empty={t("No links yet", "还没有链接")}>
        {[]}
      </ListColumn>
    </ListGrid>
  );
};

ListGridStory.storyName = "ListGrid";
ListGridStory.parameters = {
  docs: {
    description: {
      story:
        "`ListGrid` puts short lists side by side. A `ListColumn` takes its `ListRow`s as an array, and shows `empty` when it has none.",
    },
  },
};

export const SummaryListStory = () => {
  const t = useText();
  return (
    <div style={{ maxWidth: 420 }}>
      <SummaryList>
        <SummaryRow to="/users" label={t("Users", "用户")} value="1,204" />
        <SummaryRow to="/users?status=banned" label={t("Banned", "已封禁")} value="0" dim />
      </SummaryList>
    </div>
  );
};

SummaryListStory.storyName = "SummaryList";
SummaryListStory.parameters = {
  docs: {
    description: {
      story:
        '`SummaryList` holds label and value rows that link to their pages. `dim` mutes a value, for "off" or "not set".',
    },
  },
};

const meta = {
  title: "Lists and data/Overview",
  component: Callout,
  subcomponents: {
    Callouts,
    SectionTitle,
    MetricGrid,
    Metric,
    MetricSuffix,
    ListGrid,
    ListColumn,
    ListRow,
    SummaryList,
    SummaryRow,
  },
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
