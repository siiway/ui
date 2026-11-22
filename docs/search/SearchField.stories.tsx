import type { Meta } from "@storybook/react-vite";
import { Button, Spinner } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { SearchField } from "@siiway/ui-react";
import { useState } from "react";
import { Demo, useText } from "../helpers";
import descriptionMd from "./SearchFieldDescription.md?raw";

export const Default = () => {
  const t = useText();
  const [query, setQuery] = useState("");
  return (
    <Demo maxWidth={520}>
      <SearchField
        value={query}
        onChange={(_, d) => setQuery(d.value)}
        placeholder={t("Search the docs", "搜索文档")}
        aria-label={t("Search", "搜索")}
      />
    </Demo>
  );
};

export const ClearButton = () => {
  const t = useText();
  const [query, setQuery] = useState("oauth");
  return (
    <Demo maxWidth={520}>
      <SearchField
        value={query}
        onChange={(_, d) => setQuery(d.value)}
        placeholder={t("Search the docs", "搜索文档")}
        aria-label={t("Search", "搜索")}
      >
        {query && (
          <Button
            appearance="subtle"
            size="small"
            icon={<DismissRegular />}
            aria-label={t("Clear", "清除")}
            onClick={() => setQuery("")}
          />
        )}
      </SearchField>
    </Demo>
  );
};

ClearButton.parameters = {
  docs: {
    description: {
      story: "`children` show inside the field, after the input: here, a button that clears it.",
    },
  },
};

export const Loading = () => {
  const t = useText();
  return (
    <Demo maxWidth={520}>
      <SearchField placeholder={t("Search the docs", "搜索文档")} aria-label={t("Search", "搜索")}>
        <Spinner size="extra-tiny" />
      </SearchField>
    </Demo>
  );
};

Loading.parameters = {
  docs: {
    description: { story: "A spinner in `children` shows that results are on their way." },
  },
};

export const Large = () => {
  const t = useText();
  return (
    <Demo maxWidth={520}>
      <SearchField
        size="large"
        placeholder={t("Search every project", "搜索所有项目")}
        aria-label={t("Search", "搜索")}
      />
    </Demo>
  );
};

Large.parameters = {
  docs: { description: { story: '`size="large"` is for a search page\'s main box.' } },
};

const meta = {
  title: "Search/SearchField",
  component: SearchField,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
