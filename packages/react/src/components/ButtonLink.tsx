// A link drawn as a Fluent button, for a button whose only job is to open a
// page: as a link, it opens in a new tab on a middle-click, shows its address
// on hover, and reads as a link to screen readers. It goes through the app's
// router like any library link.

import {
  mergeClasses,
  useButtonStyles_unstable,
  useButton_unstable,
  type ButtonProps,
} from "@fluentui/react-components";
import type { ReactElement, ReactNode } from "react";
import { UiLink } from "../provider/context.js";

export function ButtonLink({
  to,
  appearance,
  size,
  icon,
  className,
  children,
}: {
  to: string;
  appearance?: ButtonProps["appearance"];
  size?: ButtonProps["size"];
  icon?: ReactElement;
  className?: string;
  children: ReactNode;
}) {
  // Fluent's own state and classes for a button drawn as an anchor. Only the
  // classes are used: the anchor is the router's.
  const state = useButton_unstable({ as: "a", appearance, size, icon, children }, null);
  useButtonStyles_unstable(state);
  return (
    <UiLink to={to} className={mergeClasses(state.root.className, className)}>
      {state.icon && <span className={state.icon.className}>{icon}</span>}
      {children}
    </UiLink>
  );
}
