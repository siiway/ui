import type { Meta } from "@storybook/react-vite";
import {
  Avatar,
  Badge,
  Button,
  Input,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Textarea,
} from "@fluentui/react-components";
import { AppsRegular, KeyRegular, PeopleRegular } from "@fluentui/react-icons";
import {
  SaveFooter,
  SettingsBody,
  SettingsCard,
  SettingsEmpty,
  SettingsFooter,
  SettingsLinkRow,
  SettingsPage,
  SettingsRow,
  SettingsSubhead,
  SettingsTable,
  SettingsToast,
  SkeletonTableBodyRows,
  useToastMessage,
} from "@siiway/ui-react";
import { useState } from "react";
import { useText } from "../helpers";
import descriptionMd from "./SettingsDescription.md?raw";

export const Default = () => {
  const t = useText();
  const [open, setOpen] = useState(true);
  return (
    <SettingsPage>
      <SettingsCard
        title={t("General", "常规")}
        description={t("How the app appears on consent screens.", "应用在授权页上的样子。")}
      >
        <SettingsRow
          icon={<AppsRegular />}
          label={t("Name", "名称")}
          description={t("Shown to people.", "向用户展示。")}
        >
          <Input defaultValue="Glint" />
        </SettingsRow>
        <SettingsRow
          icon={<PeopleRegular />}
          label={t("Open sign-ups", "开放注册")}
          description={t("Anyone can create an account.", "任何人都能创建账号。")}
        >
          <Switch checked={open} onChange={(_, d) => setOpen(d.checked)} />
        </SettingsRow>
      </SettingsCard>
    </SettingsPage>
  );
};

export const Header = () => {
  const t = useText();
  return (
    <SettingsCard
      title={t("General", "常规")}
      description={t("How the app appears on consent screens.", "应用在授权页上的样子。")}
      badge={<Badge appearance="tint">{t("Enabled", "已启用")}</Badge>}
      action={<Button size="small">{t("Reset", "重置")}</Button>}
    >
      <SettingsRow icon={<AppsRegular />} label={t("Name", "名称")}>
        <Input defaultValue="Glint" />
      </SettingsRow>
    </SettingsCard>
  );
};

Header.parameters = {
  docs: {
    description: {
      story: "`badge` sits beside the card's title and `action` at its top right.",
    },
  },
};

export const Subheads = () => {
  const t = useText();
  const [open, setOpen] = useState(true);
  const [consent, setConsent] = useState(true);
  return (
    <SettingsCard title={t("Sign-in", "登录")}>
      <SettingsRow
        icon={<PeopleRegular />}
        label={t("Open sign-ups", "开放注册")}
        description={t("Anyone can create an account.", "任何人都能创建账号。")}
      >
        <Switch checked={open} onChange={(_, d) => setOpen(d.checked)} />
      </SettingsRow>
      <SettingsSubhead>{t("Access", "访问")}</SettingsSubhead>
      <SettingsRow
        icon={<KeyRegular />}
        label={t("Ask for consent", "请求授权")}
        description={t("Every time the app signs someone in.", "每次应用让用户登录时。")}
      >
        <Switch checked={consent} onChange={(_, d) => setConsent(d.checked)} />
      </SettingsRow>
    </SettingsCard>
  );
};

Subheads.parameters = {
  docs: {
    description: { story: "`SettingsSubhead` is a quiet heading between groups of rows." },
  },
};

export const Saving = () => {
  const t = useText();
  const [name, setName] = useState("Glint");
  const [saved, setSaved] = useState("Glint");
  const [saving, setSaving] = useState(false);
  const { message, showMsg } = useToastMessage();
  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaved(name);
      setSaving(false);
      showMsg("success", t("Saved.", "已保存。"));
    }, 600);
  };
  return (
    <SettingsPage>
      <SettingsToast message={message} />
      <SettingsCard title={t("General", "常规")}>
        <SettingsRow icon={<AppsRegular />} label={t("Name", "名称")}>
          <Input value={name} onChange={(_, d) => setName(d.value)} />
        </SettingsRow>
        <SaveFooter
          dirty={name !== saved}
          saving={saving}
          onDiscard={() => setName(saved)}
          onSave={save}
        />
      </SettingsCard>
    </SettingsPage>
  );
};

Saving.parameters = {
  docs: {
    description: {
      story:
        "Edit the name: `SaveFooter` shows **Discard** while there are unsaved changes, and **Save** shows its spinner while saving. `SettingsToast` then shows the result from `useToastMessage`.",
    },
  },
};

export const LinkRows = () => {
  const t = useText();
  return (
    <SettingsCard title={t("Apps", "应用")}>
      <SettingsLinkRow
        to="/apps/glint"
        icon={<Avatar name="Glint" shape="square" color="colorful" />}
        label="Glint"
        description={t("Shared to-do lists", "共享待办清单")}
        meta={t("4 scopes", "4 个权限")}
      />
      <SettingsLinkRow
        to="/apps/lumen"
        icon={<Avatar name="Lumen" shape="square" color="colorful" />}
        label="Lumen"
        description={t("Photo albums", "相册")}
        meta={t("2 scopes", "2 个权限")}
      />
    </SettingsCard>
  );
};

LinkRows.parameters = {
  docs: {
    description: {
      story:
        "`SettingsLinkRow` opens another page, with an avatar as its icon. `meta` is hidden on narrow screens.",
    },
  },
};

export const Body = () => {
  const t = useText();
  return (
    <SettingsCard
      title={t("Custom CSS", "自定义 CSS")}
      description={t("Added to every page.", "加到每个页面。")}
    >
      <SettingsBody>
        <Textarea
          aria-label={t("Custom CSS", "自定义 CSS")}
          placeholder=":root { /* … */ }"
          resize="vertical"
          rows={4}
        />
      </SettingsBody>
    </SettingsCard>
  );
};

Body.parameters = {
  docs: {
    description: {
      story: "`SettingsBody` holds anything that isn't a row, such as a form or an editor.",
    },
  },
};

export const Tables = () => {
  const t = useText();
  return (
    <SettingsCard title={t("Members", "成员")}>
      <SettingsTable>
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
      </SettingsTable>
    </SettingsCard>
  );
};

Tables.parameters = {
  docs: {
    description: {
      story:
        "`SettingsTable` lines a Fluent `Table` up with the card's padding. Here the rows still loading are `SkeletonTableBodyRows`.",
    },
  },
};

export const Empty = () => {
  const t = useText();
  return (
    <SettingsCard title={t("Webhooks", "Webhook")}>
      <SettingsEmpty>{t("No webhooks.", "没有 Webhook。")}</SettingsEmpty>
      <SettingsFooter start={<Text size={200}>{t("0 of 10", "0 / 10")}</Text>}>
        <Button size="small">{t("Add", "添加")}</Button>
      </SettingsFooter>
    </SettingsCard>
  );
};

Empty.parameters = {
  docs: {
    description: {
      story:
        "`SettingsEmpty` says the card has nothing in it. `SettingsFooter` is its bottom bar: buttons as `children`, a note on the left as `start`.",
    },
  },
};

const meta = {
  title: "Settings/Settings",
  component: SettingsPage,
  subcomponents: {
    SettingsCard,
    SettingsRow,
    SettingsSubhead,
    SettingsLinkRow,
    SettingsBody,
    SaveFooter,
    SettingsToast,
    SettingsTable,
    SettingsEmpty,
    SettingsFooter,
  },
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
