// As Fluent's (microsoft/fluentui apps/public-docsite-v9/.storybook/manager.js):
// no toolbar, no addon panel, no shortcuts. Plus the dark scheme: the sidebar
// follows the docs pages' theme picker.

import { addons } from "storybook/manager-api";
import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events";
import { THEME_ID } from "./fluent/constants";
import { darkTheme, lightTheme, systemScheme } from "./theme";

function apply(scheme: unknown) {
  const dark = scheme === "dark";
  document.documentElement.dataset.scheme = dark ? "dark" : "light";
  return dark ? darkTheme : lightTheme;
}

addons.setConfig({
  theme: apply(systemScheme()),
  layout: { showPanel: false, showToolbar: false },
  ui: { enableShortcuts: false },
});

addons.register("siiway/scheme", (api) => {
  const follow = ({ globals }: { globals?: Record<string, unknown> }) => {
    if (globals?.[THEME_ID]) api.setOptions({ theme: apply(globals[THEME_ID]) });
  };
  api.on(SET_GLOBALS, follow);
  api.on(GLOBALS_UPDATED, follow);
});
