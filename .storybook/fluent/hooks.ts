// Copied from microsoft/fluentui
// packages/react-components/react-storybook-addon/src/hooks.ts (MIT, see
// LICENSE). Changes: Storybook's Vite types; the language; no useGlobals (a
// manager hook, unused in the preview).
import type { Args as StorybookArgs, StoryContext as StorybookContext, Parameters } from '@storybook/react-vite';

import type { DIR_ID, LOCALE_ID, STRICT_MODE_ID, THEME_ID, THEMES } from './constants';
import type { Theme, ThemeIds } from './theme';

export interface FluentStoryContext extends StorybookContext {
  globals: FluentGlobals;
  parameters: FluentParameters;
}

/**
 * Extends the storybook globals object to include fluent specific properties
 */
export interface FluentGlobals extends StorybookArgs {
  [DIR_ID]?: 'ltr' | 'rtl';
  [THEME_ID]?: ThemeIds;
  [THEMES]?: Theme[];
  [STRICT_MODE_ID]?: boolean;
  [LOCALE_ID]?: 'en' | 'zh';
}

/**
 * Extends the storybook parameters object to include fluent specific properties
 */
export interface FluentParameters extends Parameters {
  dir?: 'ltr' | 'rtl';
  fluentTheme?: ThemeIds;
  fluentThemes?: Theme[];
  mode?: 'default' | 'vr-test';
  reactStorybookAddon?: {
    disabledDecorators?: ['AriaLive' | 'FluentProvider' | 'ReactStrictMode'];
    docs?: FluentDocsConfig;
  };
}

/**
 * Configuration for docs components
 */
type FluentDocsConfig =
  | boolean
  | {
      tableOfContents?: boolean;
      dirSwitcher?: boolean;
      themePicker?: boolean;
      copyAsMarkdown?: boolean;
      argTable?:
        | boolean
        | {
            slotsApi?: boolean;
            nativePropsApi?: boolean;
          };
    };

export function parameters(options?: FluentParameters): FluentParameters {
  return { dir: 'ltr', fluentTheme: 'light', mode: 'default', ...options };
}
export function getParametersConfig(context: FluentStoryContext): FluentParameters['reactStorybookAddon'] {
  return context?.parameters?.reactStorybookAddon;
}
