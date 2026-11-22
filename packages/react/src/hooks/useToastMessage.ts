import { useCallback, useRef, useState } from "react";

/** A message for `SettingsToast`. */
export interface ToastMessage {
  /** Shows it as a success or an error. */
  type: "success" | "error";
  /** The message, already translated. */
  text: string;
}

/**
 * A message that clears itself, for `SettingsToast`.
 *
 * @param timeoutMs How long a message shows, in milliseconds.
 */
export function useToastMessage(timeoutMs = 5000) {
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMsg = useCallback(
    (type: ToastMessage["type"], text: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setMessage({ type, text });
      timerRef.current = setTimeout(() => setMessage(null), timeoutMs);
    },
    [timeoutMs],
  );

  return {
    /** The message to show, or `null`. Pass it to `SettingsToast`. */
    message,
    /** Shows a message, which clears after `timeoutMs`. A new one replaces
     *  the one showing and starts its own timeout. */
    showMsg,
    /** To clear or set the message yourself. */
    setMessage,
  };
}
