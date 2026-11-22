import type { Scheme } from "../scheme.js";

/**
 * The page backdrop that header, sidebar and content share, and that cards
 * sit on with a hairline border. Darker than colorNeutralBackground1 in the
 * dark scheme, so cards still read as surfaces there.
 */
export const CANVAS: Record<Scheme, string> = { light: "#ffffff", dark: "#1a1a1a" };
