// Theme and provider
export { createTheme, type CreateThemeOptions } from "./theme/createTheme.js";
export { UiProvider, type UiProviderProps } from "./provider/UiProvider.js";
export { useCanvasClass } from "./provider/canvas.js";
export {
  DEFAULT_ROUTER,
  UiLink,
  useUiMatch,
  useUiNavigate,
  useUiPageTitle,
  useUiScheme,
  useUiStrings,
  type PageTitleHandler,
  type UiLinkProps,
  type UiRouter,
} from "./provider/context.js";

// Hooks
export { useConfirm, type ConfirmOptions } from "./hooks/useConfirm.js";
export { useCopy, type CopyState } from "./hooks/useCopy.js";
export { useDebouncedSearch } from "./hooks/useDebouncedSearch.js";
export { usePageClamp } from "./hooks/usePageClamp.js";
export { useSearchShortcut, type SearchShortcutOptions } from "./hooks/useSearchShortcut.js";
export { useThemeMode, type ThemeModeOptions, type ThemeModeState } from "./hooks/useThemeMode.js";
export { useToastMessage, type ToastMessage } from "./hooks/useToastMessage.js";

// Page structure
export { PageHeader } from "./components/PageHeader.js";
export { BackButton, DetailHeader } from "./components/DetailHeader.js";
export { FormPage } from "./components/FormPage.js";
export {
  StatusPage,
  type StatusPageAction,
  type StatusPageProps,
} from "./components/StatusPage.js";
export { EmptyState } from "./components/EmptyState.js";
export { GetStartedPanel } from "./components/GetStartedPanel.js";
export { ViewBanner } from "./components/ViewBanner.js";
export { LabeledLine } from "./components/LabeledLine.js";
export { BrandMark } from "./components/BrandMark.js";

// Navigation
export {
  TOP_BAR_HEIGHT,
  TopBar,
  type TopBarBrand,
  type TopBarLink,
  type TopBarProps,
} from "./components/TopBar.js";
export {
  SideNav,
  type SideNavGroup,
  type SideNavItem,
  type SideNavProps,
} from "./components/SideNav.js";
export { Outline, type OutlineItem, type OutlineProps } from "./components/Outline.js";
export { PrevNext, type PrevNextLink, type PrevNextProps } from "./components/PrevNext.js";
export { LoadingBar } from "./components/LoadingBar.js";

// Search
export { SearchField, type SearchFieldProps } from "./components/SearchField.js";
export { SearchButton, type SearchButtonProps } from "./components/SearchButton.js";
export {
  CommandPalette,
  type CommandGroup,
  type CommandItem,
  type CommandPaletteProps,
} from "./components/CommandPalette.js";

// Settings
export {
  SaveFooter,
  SettingsBody,
  SettingsCard,
  SettingsEmpty,
  SettingsFooter,
  SettingsLinkRow,
  SettingsPage,
  SettingsRow,
  SettingsSubhead,
  SettingsTable,
  SettingsToast,
} from "./components/Settings.js";

// Lists and data
export {
  DataList,
  DataListLink,
  DataListName,
  DataListRow,
  DataListSkeleton,
  type DataListColumn,
} from "./components/DataList.js";
export { Pagination } from "./components/Pagination.js";
export { ListSearch } from "./components/ListSearch.js";
export {
  Callout,
  Callouts,
  ListColumn,
  ListGrid,
  ListRow,
  Metric,
  MetricGrid,
  MetricSuffix,
  SectionTitle,
  SummaryList,
  SummaryRow,
} from "./components/Overview.js";
export {
  SkeletonSettingsCard,
  SkeletonSettingsPage,
  SkeletonStatCards,
  SkeletonTableBodyRows,
  SkeletonTableRows,
} from "./components/Skeletons.js";

// Inputs
export { Segmented, type SegmentedOption } from "./components/Segmented.js";
export { ThemeSwitch, type ThemeSwitchProps } from "./components/ThemeSwitch.js";
export { ThemeMenu, type ThemeMenuProps } from "./components/ThemeMenu.js";
export { Select } from "./components/Select.js";
export { CheckboxField } from "./components/CheckboxField.js";
export { PasswordInput } from "./components/PasswordInput.js";
export { DurationInput } from "./components/DurationInput.js";
export { ColorPickerInput } from "./components/ColorPickerInput.js";

// Copy
export { CopyButton } from "./components/CopyButton.js";
export { CopyIdText, CopyIdTrigger } from "./components/CopyIdTrigger.js";

// Re-exported from @siiway/ui-core for convenience
export {
  CANVAS,
  DEFAULT_ACCENT,
  SCHEME_COOKIE,
  THEME_STORAGE_KEY,
  resolveScheme,
  schemeBootScript,
  schemeCookie,
  schemeFromRequest,
  type Scheme,
  type ThemeMode,
  type UiStrings,
  type DurationUnit,
} from "@siiway/ui-core";
