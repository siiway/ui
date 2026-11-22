import { Text } from "@fluentui/react-components";
import type { ReactNode } from "react";

interface LabeledLineProps {
  /** The label, before the colon. */
  label: ReactNode;
  /** The value. */
  children: ReactNode;
  /** Sets the value in monospace. */
  mono?: boolean;
}

export function LabeledLine({ label, children, mono }: LabeledLineProps) {
  return (
    <Text size={200}>
      <Text size={200} weight="semibold">
        {label}:
      </Text>{" "}
      {mono ? (
        <Text size={200} font="monospace">
          {children}
        </Text>
      ) : (
        children
      )}
    </Text>
  );
}
