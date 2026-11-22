import type { UiStrings } from "./types.js";

export const en: UiStrings = {
  cancel: "Cancel",
  clear: "Clear",
  close: "Close",
  required: "Required",

  copy: "Copy",
  copied: "Copied!",
  copyFailed: "Copy failed",

  saveChanges: "Save changes",
  discardChanges: "Discard changes",

  showPassword: "Show password",
  hidePassword: "Hide password",

  previous: "Previous",
  next: "Next",
  pageOf: (page, total) => `${page} / ${total}`,
  totalItems: (count) => (count === 1 ? `${count} item` : `${count} items`),
  pageNumber: "Page",
  goToPage: "Go to page",
  go: "Go",

  pickColor: "Pick a color",
  hexColor: "Hex color",
  optionalHexColor: "Optional hex color",
  invalidHexColor: "Enter a three- or six-digit hex color.",
  colorArea: "Color saturation and brightness",
  saturation: "Saturation",
  brightness: "Brightness",
  hue: "Hue",

  theme: "Theme",
  themeSystem: "System",
  themeLight: "Light",
  themeDark: "Dark",

  search: "Search",
  commandMove: "to move",
  commandOpen: "to open",
  commandClose: "to close",

  onThisPage: "On this page",
  openNavigation: "Open navigation",
  primaryNavigation: "Primary",
  duration: (value, unit) =>
    unit === "minutes" ? `${value} min` : value === 1 ? "1 day" : `${value} days`,
  durationUnits: {
    s: ["s", "sec", "secs", "second", "seconds"],
    m: ["m", "min", "mins", "minute", "minutes"],
    h: ["h", "hr", "hrs", "hour", "hours"],
    d: ["d", "day", "days"],
    w: ["w", "wk", "wks", "week", "weeks"],
    mo: ["mo", "mon", "month", "months"],
    y: ["y", "yr", "yrs", "year", "years"],
  },
  durationInvalid: "Invalid format: try “60” or “1 hour”",
  durationNotPositive: "Must be a positive duration",
  durationUnknownUnit: "Unknown time unit",
};
