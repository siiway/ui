import type { Meta } from "@storybook/react-vite";
import { Button, Text } from "@fluentui/react-components";
import {
  AppsRegular,
  DismissRegular,
  DocumentRegular,
  HistoryRegular,
  PeopleTeamRegular,
  SettingsRegular,
} from "@fluentui/react-icons";
import { CommandPalette, SearchButton, type CommandGroup } from "@siiway/ui-react";
import { useState, type ReactNode } from "react";
import { Demo, useText } from "../helpers";
import descriptionMd from "./CommandPaletteDescription.md?raw";

// The stories open the palette from a SearchButton only: Ctrl K
// (useSearchShortcut) would open every palette on the page at once.

// Without `query`, the palette empties the field each time it opens; the
// app only hears the text, to search with it.
export const Default = () => {
  const t = useText();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const pages = [
    { id: "apps", title: t("Apps", "应用"), icon: <AppsRegular />, data: "/apps" },
    { id: "teams", title: t("Teams", "团队"), icon: <PeopleTeamRegular />, data: "/teams" },
    { id: "settings", title: t("Settings", "设置"), icon: <SettingsRegular />, data: "/settings" },
  ];
  const q = query.trim().toLowerCase();
  return (
    <Demo layout="row">
      <SearchButton onClick={() => setOpen(true)} shortcut={false} />
      {picked && (
        <Text size={200} font="monospace">
          {picked}
        </Text>
      )}
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        onQueryChange={setQuery}
        placeholder={t("Search pages…", "搜索页面…")}
        groups={[
          {
            label: t("Pages", "页面"),
            items: pages.filter((page) => page.title.toLowerCase().includes(q)),
          },
        ]}
        empty={<Text>{t(`No results for “${query}”`, `没有与“${query}”匹配的结果`)}</Text>}
        onSelect={(item) => {
          // Where the row leads, from its data.
          setPicked(item.data ?? null);
          setOpen(false);
        }}
      />
    </Demo>
  );
};

// Wraps what matches the query in <mark>, as a search's highlights would.
function highlight(text: string, query: string): ReactNode {
  const at = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  );
}

export const SearchResults = () => {
  const t = useText();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const docs = [
    {
      id: "oauth",
      title: t("Sign in with OAuth", "使用 OAuth 登录"),
      subtitle: "/docs/sign-in/oauth",
      excerpt: t(
        "Register an app, then send people to the authorize endpoint with its client ID.",
        "注册一个应用，然后带着它的客户端 ID 把用户发往授权端点。",
      ),
    },
    {
      id: "passkeys",
      title: t("Sign in with a passkey", "使用通行密钥登录"),
      subtitle: "/docs/sign-in/passkeys",
      excerpt: t(
        "People sign in with their device's lock instead of a password.",
        "用户用设备的解锁方式登录，无需密码。",
      ),
    },
  ];
  const q = query.trim();
  const matches = docs.filter((doc) =>
    `${doc.title} ${doc.excerpt}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <SearchButton onClick={() => setOpen(true)} shortcut={false} />
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        onQueryChange={setQuery}
        placeholder={t("Search the docs…", "搜索文档…")}
        groups={[
          {
            label: t("Docs", "文档"),
            items: matches.map((doc) => ({
              id: doc.id,
              title: highlight(doc.title, q),
              subtitle: doc.subtitle,
              excerpt: highlight(doc.excerpt, q),
              icon: <DocumentRegular />,
            })),
          },
        ]}
        status={q && <span>{t(`${matches.length} results`, `${matches.length} 个结果`)}</span>}
        onSelect={() => setOpen(false)}
      />
    </>
  );
};

SearchResults.parameters = {
  docs: {
    description: {
      story:
        "A row's `subtitle` is one line under its title, its `excerpt` up to two. Matched words are wrapped in `<mark>`, and `status` counts the results.",
    },
  },
};

export const Recent = () => {
  const t = useText();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(["oauth", t("passkey", "通行密钥")]);
  const docs = [
    { id: "oauth", title: t("Sign in with OAuth", "使用 OAuth 登录"), icon: <DocumentRegular /> },
    {
      id: "passkeys",
      title: t("Sign in with a passkey", "使用通行密钥登录"),
      icon: <DocumentRegular />,
    },
  ];
  const q = query.trim().toLowerCase();
  const groups: CommandGroup[] = q
    ? [
        {
          label: t("Docs", "文档"),
          items: docs.filter((doc) => doc.title.toLowerCase().includes(q)),
        },
      ]
    : [
        {
          label: t("Recent", "最近搜索"),
          action: (
            <Button appearance="subtle" size="small" onClick={() => setRecent([])}>
              {t("Clear", "清除")}
            </Button>
          ),
          items: recent.map((search) => ({
            id: `recent:${search}`,
            title: search,
            icon: <HistoryRegular />,
            action: (
              <Button
                appearance="subtle"
                size="small"
                icon={<DismissRegular />}
                aria-label={`${t("Remove", "移除")}: ${search}`}
                onClick={() => setRecent((list) => list.filter((x) => x !== search))}
              />
            ),
          })),
        },
      ];
  return (
    <>
      <SearchButton onClick={() => setOpen(true)} shortcut={false} />
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        placeholder={t("Search the docs…", "搜索文档…")}
        groups={groups}
        onSelect={(item) => {
          // A recent search runs again; a page opens.
          if (item.id.startsWith("recent:")) setQuery(item.id.slice("recent:".length));
          else setOpen(false);
        }}
      />
    </>
  );
};

Recent.parameters = {
  docs: {
    description: {
      story:
        "Before a search, show recent ones. The group's `action` clears them, and each row's `action` removes one without opening the row. Picking one searches for it again by setting `query`, so here the app holds the field's text.",
    },
  },
};

const meta = {
  title: "Search/CommandPalette",
  component: CommandPalette,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
