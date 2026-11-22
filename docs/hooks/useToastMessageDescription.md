A message that clears itself, for [`SettingsToast`](?path=/docs/settings-settings--docs).

## Parameters

| Parameter   | Type     | Default | Notes                                      |
| ----------- | -------- | ------- | ------------------------------------------ |
| `timeoutMs` | `number` | `5000`  | How long a message shows, in milliseconds. |

## Returns

| Name         | Type                                                 | Notes                                                    |
| ------------ | ---------------------------------------------------- | -------------------------------------------------------- |
| `message`    | `ToastMessage \| null`                               | `{ type, text }`, or `null`. Pass it to `SettingsToast`. |
| `showMsg`    | `(type: "success" \| "error", text: string) => void` | Shows a message, which clears after `timeoutMs`.         |
| `setMessage` | `Dispatch<SetStateAction<ToastMessage \| null>>`     | To clear or set it yourself.                             |
