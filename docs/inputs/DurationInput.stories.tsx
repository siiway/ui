import type { Meta } from "@storybook/react-vite";
import { Field, Text } from "@fluentui/react-components";
import { DurationInput } from "@siiway/ui-react";
import { useState } from "react";
import { Demo, useText } from "../helpers";
import descriptionMd from "./DurationInputDescription.md?raw";

export const Default = () => {
  const t = useText();
  const [days, setDays] = useState<number | null>(30);
  return (
    <Demo layout="stack" maxWidth={320}>
      <Field label={t("Token lifetime", "令牌有效期")}>
        <DurationInput value={days} onChange={setDays} unit="days" />
      </Field>
      <Text size={200} font="monospace">
        days={String(days)}
      </Text>
    </Demo>
  );
};

export const Blank = () => {
  const t = useText();
  const [minutes, setMinutes] = useState<number | null>(null);
  return (
    <Demo layout="stack" maxWidth={320}>
      <Field label={t("Session timeout (blank: the site default)", "会话超时（留空：站点默认）")}>
        <DurationInput value={minutes} onChange={setMinutes} unit="minutes" placeholder="60 min" />
      </Field>
      <Text size={200} font="monospace">
        minutes={String(minutes)}
      </Text>
    </Demo>
  );
};

Blank.parameters = {
  docs: {
    description: {
      story:
        'With `value={null}` the field is blank and shows its `placeholder`. Clearing the field gives `null`, for "use the default".',
    },
  },
};

export const Required = () => {
  const t = useText();
  const [days, setDays] = useState<number | null>(30);
  return (
    <Demo maxWidth={320}>
      <Field label={t("Token lifetime", "令牌有效期")}>
        <DurationInput value={days} onChange={setDays} unit="days" allowBlank={false} />
      </Field>
    </Demo>
  );
};

Required.parameters = {
  docs: {
    description: {
      story:
        "With `allowBlank={false}`, clearing the field shows an error and puts back the last value.",
    },
  },
};

const meta = {
  title: "Inputs/DurationInput",
  component: DurationInput,
  parameters: { docs: { description: { component: descriptionMd } } },
} satisfies Meta;
export default meta;
