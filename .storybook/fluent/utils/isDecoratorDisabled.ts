// Copied from microsoft/fluentui
// packages/react-components/react-storybook-addon/src/utils/isDecoratorDisabled.ts
// (MIT, see ../LICENSE).
import { getParametersConfig, type FluentParameters, type FluentStoryContext } from '../hooks';

type DecoratorName = NonNullable<NonNullable<FluentParameters['reactStorybookAddon']>['disabledDecorators']>[number];

export function isDecoratorDisabled(context: FluentStoryContext, decoratorName: DecoratorName): boolean {
  return getParametersConfig(context)?.disabledDecorators?.includes(decoratorName) ?? false;
}
