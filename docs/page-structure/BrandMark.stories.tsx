import type { Meta } from "@storybook/react-vite";
import { BrandMark } from "@siiway/ui-react";
import { Demo } from "../helpers";
import descriptionMd from "./BrandMarkDescription.md?raw";

export const Default = () => {
  return <BrandMark name="SiiWay" iconUrl="https://icons.siiway.org/siiway/icon.svg" />;
};

export const Sizes = () => {
  return (
    <Demo layout="row">
      <BrandMark name="SiiWay" iconUrl="https://icons.siiway.org/siiway/icon.svg" />
      <BrandMark name="Prism" iconUrl="https://icons.siiway.org/prism/icon.svg" size={40} />
      <BrandMark name="Vellum" iconUrl="https://icons.siiway.org/vellum/icon.svg" size={56} />
    </Demo>
  );
};

Sizes.parameters = {
  docs: {
    description: {
      story: "`size` sets the width and height in pixels. The corners round in proportion.",
    },
  },
};

const meta = {
  title: "Page structure/BrandMark",
  component: BrandMark,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
