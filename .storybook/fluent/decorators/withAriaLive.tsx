// Copied from microsoft/fluentui
// packages/react-components/react-storybook-addon/src/decorators/withAriaLive.tsx
// (MIT, see ../LICENSE). Changes: imports from @fluentui/react-components.
import { AriaLiveAnnouncer, type JSXElement } from '@fluentui/react-components';
import * as React from 'react';

import type { FluentStoryContext } from '../hooks';
import { isDecoratorDisabled } from '../utils/isDecoratorDisabled';

export const withAriaLive = (Story: () => JSXElement, context: FluentStoryContext): JSXElement => {
  if (isDecoratorDisabled(context, 'AriaLive')) {
    return Story();
  }

  return (
    <AriaLiveWrapper>
      <Story />
    </AriaLiveWrapper>
  );
};

const AriaLiveWrapper: React.FC<{ children: React.ReactNode }> = props => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // The AriaLiveAnnouncer appends an element to DOM in an effect
    // Trigger an extra renderer to make sure that doc examples that need to announce on mount can do so
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return <AriaLiveAnnouncer>{mounted && props.children}</AriaLiveAnnouncer>;
};
