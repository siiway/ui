Asks a yes-or-no question in a dialog and waits for the answer. Render
`confirmDialog` once, anywhere in the component.

## Returns

| Name            | Type                                            | Notes                                                                                     |
| --------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `confirm`       | `(options: ConfirmOptions) => Promise<boolean>` | Opens the dialog. Resolves to `true` when confirmed and `false` when cancelled or closed. |
| `confirmDialog` | `JSX.Element`                                   | The dialog. Render it once.                                                               |

## Options

`confirm` takes:

| Option         | Type        | Notes                                  |
| -------------- | ----------- | -------------------------------------- |
| `title`        | `string`    | The question.                          |
| `body`         | `ReactNode` | Optional. More detail under the title. |
| `confirmLabel` | `string`    | The confirming button's label.         |
