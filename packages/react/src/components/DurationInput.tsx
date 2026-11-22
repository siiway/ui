// Input that accepts free-form duration text (e.g. "60", "60min", "1 hour",
// "30 days") and commits an integer in the field's storage unit on blur.
// Empty input commits `null`, meaning "use the site default".
//
// Why a custom component (and not Fluent's SpinButton): SpinButton's
// controlled state diverges from `value`/`displayValue` on invalid intermediate
// input — typing "60min" and then clicking elsewhere left the box blank.
// This component keeps a local string buffer that's only synced from `value`
// when `value` changes externally, so user typing is preserved across blur
// until we successfully parse it.

import { Input, Text, tokens } from "@fluentui/react-components";
import { useEffect, useRef, useState } from "react";
import { useUiStrings } from "../provider/context.js";
import { UI_STRINGS, parseDuration, type DurationUnit } from "@siiway/ui-core";

interface DurationInputProps {
  /** The length of time as a whole number in `unit`. `null` is blank. */
  value: number | null;
  /** Called with the new value, or `null` for blank, when the text is read
   *  (on blur or Enter), not on every keystroke. Text it can't read shows an
   *  error and doesn't call it. */
  onChange: (value: number | null) => void;
  /** The unit of `value`, `minutes` or `days`. A bare number is read in this
   *  unit. */
  unit: DurationUnit;
  /** Shown while the field is blank. */
  placeholder?: string;
  /** Disables the field. */
  disabled?: boolean;
  /** Whether the field may be left blank, giving `null`. Default `true`:
   *  blank means "use the default". When `false`, a blank field shows
   *  "Required" and puts back the last value. */
  allowBlank?: boolean;
  /** The text input's `id`. */
  id?: string;
}

export function DurationInput({
  value,
  onChange,
  unit,
  placeholder,
  disabled,
  allowBlank = true,
  id,
}: DurationInputProps) {
  const strings = useUiStrings();
  // Local buffer of the displayed text. Synced from `value` only when value
  // changes externally — typing while the field is focused doesn't cause
  // a parent state round-trip on every keystroke.
  const { duration } = strings;
  const format = (next: number | null) => (next === null ? "" : duration(next, unit));
  const [text, setText] = useState<string>(() => format(value));
  const [error, setError] = useState<string | null>(null);
  // Track focus via ref so the sync effect doesn't re-run on focus changes —
  // that would overwrite a parse-error buffer the user is mid-edit. The
  // effect only fires when the parent's `value` (or unit, or the language)
  // actually changes.
  const focusedRef = useRef(false);

  useEffect(() => {
    if (focusedRef.current) return;
    setText(value === null ? "" : duration(value, unit));
  }, [value, unit, duration]);

  const commit = () => {
    // The app's language, and English, which people type in any language.
    const result = parseDuration(text, unit, [strings.durationUnits, UI_STRINGS.en.durationUnits]);
    if (result.kind === "blank") {
      if (allowBlank) {
        setError(null);
        onChange(null);
        setText("");
      } else {
        setError(strings.required);
        // Restore last known good value so the box doesn't go blank.
        setText(format(value));
      }
      return;
    }
    if (result.kind === "error") {
      setError(
        result.reason === "non_positive"
          ? strings.durationNotPositive
          : result.reason === "unknown_unit"
            ? strings.durationUnknownUnit
            : strings.durationInvalid,
      );
      // Keep the user's text so they can correct it; revert the canonical
      // value parent-side to whatever it was.
      return;
    }
    setError(null);
    onChange(result.value);
    // Re-format so "60min" becomes "60 min" — gives feedback that we parsed
    // it the way they expected.
    setText(format(result.value));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Input
        id={id}
        value={text}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(_, d) => {
          setText(d.value);
          if (error) setError(null);
        }}
        onFocus={() => {
          focusedRef.current = true;
        }}
        onBlur={() => {
          focusedRef.current = false;
          commit();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
      />
      {error && (
        <Text size={100} style={{ color: tokens.colorPaletteRedForeground1 }}>
          {error}
        </Text>
      )}
    </div>
  );
}
