/**
 * The text the library's own components show: button labels, feedback,
 * `aria-label`s and placeholders. Everything else comes in as props, already
 * translated by the app. Each locale satisfies this type, so a key missing
 * from one fails the typecheck.
 */
import type { DurationUnit, DurationUnitWords } from "../duration.js";

export interface UiStrings {
  cancel: string;
  clear: string;
  close: string;
  required: string;

  copy: string;
  copied: string;
  copyFailed: string;

  saveChanges: string;
  discardChanges: string;

  showPassword: string;
  hidePassword: string;

  previous: string;
  next: string;
  /** Pagination position, e.g. "2 / 7". */
  pageOf: (page: number, total: number) => string;
  totalItems: (count: number) => string;
  /** Placeholder of the go-to-page field. */
  pageNumber: string;
  goToPage: string;
  go: string;

  pickColor: string;
  hexColor: string;
  optionalHexColor: string;
  invalidHexColor: string;
  colorArea: string;
  saturation: string;
  brightness: string;
  hue: string;

  /** Label of the theme switch. */
  theme: string;
  themeSystem: string;
  themeLight: string;
  themeDark: string;

  /** The search button's label and the command palette's field name. */
  search: string;
  /** The command palette's key hints, each after its key: "↑ ↓ to move". */
  commandMove: string;
  commandOpen: string;
  commandClose: string;

  /** The outline's heading. */
  onThisPage: string;
  /** The top bar's menu button, which opens the navigation on a narrow screen. */
  openNavigation: string;
  /** Names the top bar's links for screen readers. */
  primaryNavigation: string;

  /** A duration as the duration field shows it, e.g. "30 days". It must read
   *  back with `parseDuration`. */
  duration: (value: number, unit: DurationUnit) => string;
  /** This language's words for each unit, which the duration field reads. */
  durationUnits: DurationUnitWords;
  /** The duration field's errors. */
  durationInvalid: string;
  durationNotPositive: string;
  durationUnknownUnit: string;
}

/** Locales the library ships strings for. */
export type UiLocale = "en" | "zh";
