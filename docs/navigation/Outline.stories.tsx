import type { Meta } from "@storybook/react-vite";
import { Outline } from "@siiway/ui-react";
import { Demo, useText } from "../helpers";
import descriptionMd from "./OutlineDescription.md?raw";

// The items are the headings of this docs page (the stories' own), so the
// outline follows the page as you scroll, and a click takes you to one.

export const Default = () => {
  return (
    <Demo maxWidth={240}>
      <Outline
        items={[
          { id: "default", label: "Default", depth: 3 },
          { id: "label", label: "Label", depth: 3 },
          { id: "nested", label: "Nested", depth: 3 },
        ]}
      />
    </Demo>
  );
};

export const Label = () => {
  const t = useText();
  return (
    <Demo maxWidth={240}>
      <Outline
        label={t("Contents", "目录")}
        items={[
          { id: "default", label: "Default", depth: 3 },
          { id: "label", label: "Label", depth: 3 },
          { id: "nested", label: "Nested", depth: 3 },
        ]}
      />
    </Demo>
  );
};

Label.parameters = {
  docs: {
    description: {
      story: '`label` replaces the heading above the list, the library\'s "On this page".',
    },
  },
};

export const Nested = () => {
  return (
    <Demo maxWidth={240}>
      <Outline
        items={[
          {
            id: "stories",
            label: "Stories",
            depth: 2,
            children: [
              { id: "label", label: "Label", depth: 3 },
              { id: "nested", label: "Nested", depth: 3 },
            ],
          },
        ]}
      />
    </Demo>
  );
};

Nested.parameters = {
  docs: {
    description: {
      story: "The headings under a heading go in its `children`. Each is indented by its `depth`.",
    },
  },
};

const meta = {
  title: "Navigation/Outline",
  component: Outline,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
