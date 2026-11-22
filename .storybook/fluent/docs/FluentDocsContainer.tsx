// Copied from microsoft/fluentui
// packages/react-components/react-storybook-addon/src/docs/FluentDocsContainer.tsx
// (MIT, see ../LICENSE). Changes: the page is the library's provider in the
// picked scheme rather than Fluent's light theme: <UiProvider page> paints the
// canvas and sets data-scheme on <html> for docs.css, and Storybook's own
// blocks (the code, the props tables) follow it.
import * as React from 'react';
import { DocsContainer, type DocsContextProps } from '@storybook/addon-docs/blocks';
import { UiProvider } from '@siiway/ui-react';

import { useStoryGlobals } from '../../globals';
import { darkTheme, lightTheme } from '../../theme';
import { isDocsEnabled } from './utils';

interface FluentDocsContainerProps {
  context: DocsContextProps;
  children: React.ReactNode;
}

/**
 * A container that wraps storybook's native docs container to add extra components to the docs experience
 */
export const FluentDocsContainer: React.FC<FluentDocsContainerProps> = ({ children, context }) => {
  const { scheme } = useStoryGlobals();

  if (isDocsEnabled(context)) {
    return (
      <UiProvider scheme={scheme} page className="sb-unstyled">
        <DocsContainer context={context} theme={scheme === 'dark' ? darkTheme : lightTheme}>
          {children}
        </DocsContainer>
      </UiProvider>
    );
  }

  // If docs container is not enabled, fall back to Storybook's default docs container
  return <DocsContainer context={context}>{children}</DocsContainer>;
};
